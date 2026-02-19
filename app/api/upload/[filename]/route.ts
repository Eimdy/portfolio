import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

/**
 * DELETE /api/upload/[filename] - Delete an uploaded file
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        // Security: only allow deleting from uploads directory
        // Validate filename format (UUID + extension only)
        const validFilename = /^[a-f0-9-]+\.(jpg|jpeg|png|gif|webp|svg|mp4|webm)$/i;
        if (!validFilename.test(filename)) {
            return NextResponse.json(
                { error: 'Invalid filename' },
                { status: 400 }
            );
        }

        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

        // Prevent path traversal
        const resolvedPath = path.resolve(filePath);
        const uploadsDir = path.resolve(path.join(process.cwd(), 'public', 'uploads'));
        if (!resolvedPath.startsWith(uploadsDir)) {
            return NextResponse.json(
                { error: 'Invalid path' },
                { status: 400 }
            );
        }

        if (!existsSync(filePath)) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        await unlink(filePath);

        return NextResponse.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Delete file error:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}
