import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
};

/**
 * GET /uploads/[filename] - Serve uploaded files dynamically
 * This is needed because Next.js production does not auto-serve
 * files added to public/ after build time.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        // Validate filename (UUID + allowed extension only)
        const validFilename = /^[a-f0-9-]+\.(jpg|jpeg|png|gif|webp|svg|mp4|webm)$/i;
        if (!validFilename.test(filename)) {
            return new NextResponse('Not Found', { status: 404 });
        }

        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

        // Prevent path traversal
        const resolvedPath = path.resolve(filePath);
        const uploadsDir = path.resolve(path.join(process.cwd(), 'public', 'uploads'));
        if (!resolvedPath.startsWith(uploadsDir)) {
            return new NextResponse('Not Found', { status: 404 });
        }

        if (!existsSync(filePath)) {
            return new NextResponse('Not Found', { status: 404 });
        }

        const ext = path.extname(filename).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        const fileBuffer = await readFile(filePath);

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': fileBuffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Serve file error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
