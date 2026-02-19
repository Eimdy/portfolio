import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Allowed file types with their magic bytes signatures
const ALLOWED_TYPES: Record<string, { mimeTypes: string[]; maxSize: number; magicBytes?: number[][] }> = {
    // Images
    '.jpg': {
        mimeTypes: ['image/jpeg'],
        maxSize: 10 * 1024 * 1024, // 10MB
        magicBytes: [[0xFF, 0xD8, 0xFF]],
    },
    '.jpeg': {
        mimeTypes: ['image/jpeg'],
        maxSize: 10 * 1024 * 1024,
        magicBytes: [[0xFF, 0xD8, 0xFF]],
    },
    '.png': {
        mimeTypes: ['image/png'],
        maxSize: 10 * 1024 * 1024,
        magicBytes: [[0x89, 0x50, 0x4E, 0x47]],
    },
    '.gif': {
        mimeTypes: ['image/gif'],
        maxSize: 10 * 1024 * 1024,
        magicBytes: [[0x47, 0x49, 0x46, 0x38]],
    },
    '.webp': {
        mimeTypes: ['image/webp'],
        maxSize: 10 * 1024 * 1024,
        // WebP starts with RIFF....WEBP
        magicBytes: [[0x52, 0x49, 0x46, 0x46]],
    },
    '.svg': {
        mimeTypes: ['image/svg+xml'],
        maxSize: 2 * 1024 * 1024, // 2MB for SVG (text-based)
        // SVG is XML-based, check for text patterns instead
    },
    // Videos
    '.mp4': {
        mimeTypes: ['video/mp4'],
        maxSize: 100 * 1024 * 1024, // 100MB
        // MP4 has ftyp box, but offset varies
    },
    '.webm': {
        mimeTypes: ['video/webm'],
        maxSize: 100 * 1024 * 1024,
        magicBytes: [[0x1A, 0x45, 0xDF, 0xA3]],
    },
};

const VIDEO_EXTENSIONS = ['.mp4', '.webm'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

/**
 * Validate magic bytes of file buffer
 */
function validateMagicBytes(buffer: Buffer, extension: string): boolean {
    const typeInfo = ALLOWED_TYPES[extension];
    if (!typeInfo?.magicBytes) {
        // For types without magic bytes (SVG, MP4), do content-based validation
        if (extension === '.svg') {
            const content = buffer.toString('utf-8', 0, Math.min(buffer.length, 1024));
            return content.includes('<svg') || content.includes('<?xml');
        }
        if (extension === '.mp4') {
            // MP4 should contain 'ftyp' within first 12 bytes
            const header = buffer.toString('ascii', 0, Math.min(buffer.length, 12));
            return header.includes('ftyp');
        }
        return true;
    }

    return typeInfo.magicBytes.some(signature =>
        signature.every((byte, index) => buffer[index] === byte)
    );
}

/**
 * Sanitize SVG content to prevent XSS
 */
function isSvgSafe(buffer: Buffer): boolean {
    const content = buffer.toString('utf-8');
    const dangerousPatterns = [
        /<script/i,
        /on\w+\s*=/i, // onclick, onload, etc.
        /javascript:/i,
        /data:text\/html/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /<foreignObject/i,
    ];
    return !dangerousPatterns.some(pattern => pattern.test(content));
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const results: { url: string; originalName: string; type: 'image' | 'video' }[] = [];
        const errors: { file: string; error: string }[] = [];

        for (const file of files) {
            try {
                // Get file extension
                const originalName = file.name;
                const ext = path.extname(originalName).toLowerCase();

                // Validate extension
                if (!ALLOWED_TYPES[ext]) {
                    errors.push({
                        file: originalName,
                        error: `File type "${ext}" is not allowed. Allowed: ${Object.keys(ALLOWED_TYPES).join(', ')}`,
                    });
                    continue;
                }

                const typeInfo = ALLOWED_TYPES[ext];

                // Validate MIME type
                if (!typeInfo.mimeTypes.includes(file.type)) {
                    errors.push({
                        file: originalName,
                        error: `Invalid MIME type "${file.type}" for ${ext} file`,
                    });
                    continue;
                }

                // Validate file size
                if (file.size > typeInfo.maxSize) {
                    const maxMB = Math.round(typeInfo.maxSize / (1024 * 1024));
                    errors.push({
                        file: originalName,
                        error: `File size (${Math.round(file.size / (1024 * 1024))}MB) exceeds maximum ${maxMB}MB`,
                    });
                    continue;
                }

                // Read file buffer
                const buffer = Buffer.from(await file.arrayBuffer());

                // Validate magic bytes
                if (!validateMagicBytes(buffer, ext)) {
                    errors.push({
                        file: originalName,
                        error: 'File content does not match its extension (possible malicious file)',
                    });
                    continue;
                }

                // Extra SVG security check
                if (ext === '.svg' && !isSvgSafe(buffer)) {
                    errors.push({
                        file: originalName,
                        error: 'SVG contains potentially dangerous content (scripts, event handlers)',
                    });
                    continue;
                }

                // Generate secure random filename
                const uuid = crypto.randomUUID();
                const safeFilename = `${uuid}${ext}`;
                const filePath = path.join(uploadDir, safeFilename);

                // Write file
                await writeFile(filePath, buffer);

                const fileType: 'image' | 'video' = VIDEO_EXTENSIONS.includes(ext) ? 'video' : 'image';

                results.push({
                    url: `/uploads/${safeFilename}`,
                    originalName,
                    type: fileType,
                });
            } catch (fileError) {
                console.error(`Error processing file ${file.name}:`, fileError);
                errors.push({
                    file: file.name,
                    error: 'Failed to process file',
                });
            }
        }

        return NextResponse.json({
            uploaded: results,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
