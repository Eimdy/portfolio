import { NextRequest, NextResponse } from 'next/server';
import { contentQueries } from '@/lib/db';

// GET /api/content/[id] - Get content by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        const content = contentQueries.getById(id);

        if (!content) {
            return NextResponse.json(
                { error: 'Content not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json(
            { error: 'Failed to fetch content' },
            { status: 500 }
        );
    }
}

// PUT /api/content/[id] - Update content
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { type, title, slug, description, content, tags, image, featured } = body;

        // Check if content exists
        const existing = contentQueries.getById(id) as any;
        if (!existing) {
            return NextResponse.json(
                { error: 'Content not found' },
                { status: 404 }
            );
        }

        // Validate type if provided
        if (type && type !== 'blog' && type !== 'project') {
            return NextResponse.json(
                { error: 'Invalid type. Must be "blog" or "project"' },
                { status: 400 }
            );
        }

        // If setting this post as featured, unset all other featured posts (only for blogs)
        const targetType = type || existing.type;
        if (targetType === 'blog' && (featured === 1 || featured === true)) {
            const allContent = contentQueries.getAll('blog');
            allContent.forEach((item: any) => {
                if (item.id !== id && item.featured === 1) {
                    contentQueries.update(item.id, { featured: 0 });
                }
            });
        }

        // Update content
        const updateData: any = {};
        if (type) updateData.type = type;
        if (title) updateData.title = title;
        if (slug) updateData.slug = slug;
        if (description) updateData.description = description;
        if (content) updateData.content = content;
        if (tags) updateData.tags = tags;
        if (image) updateData.image = image;
        if (featured !== undefined) updateData.featured = featured ? 1 : 0;

        contentQueries.update(id, updateData);

        return NextResponse.json({ message: 'Content updated successfully' });
    } catch (error: any) {
        console.error('Error updating content:', error);

        // Handle unique constraint violation (duplicate slug)
        if (error.message?.includes('UNIQUE constraint failed')) {
            return NextResponse.json(
                { error: 'A content item with this slug already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update content' },
            { status: 500 }
        );
    }
}

// DELETE /api/content/[id] - Delete content
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        // Check if content exists
        const existing = contentQueries.getById(id);
        if (!existing) {
            return NextResponse.json(
                { error: 'Content not found' },
                { status: 404 }
            );
        }

        contentQueries.delete(id);

        return NextResponse.json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error);
        return NextResponse.json(
            { error: 'Failed to delete content' },
            { status: 500 }
        );
    }
}
