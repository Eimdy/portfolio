import { NextRequest, NextResponse } from 'next/server';
import { contentQueries, initializeDatabase } from '@/lib/db';

// Initialize database on first request
let dbInitialized = false;

function ensureDbInitialized() {
    if (!dbInitialized) {
        initializeDatabase();
        dbInitialized = true;
    }
}

// GET /api/content - Get all content or filter by type
export async function GET(request: NextRequest) {
    try {
        ensureDbInitialized();

        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type') as 'blog' | 'project' | null;
        const query = searchParams.get('q');
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam) : undefined;

        let content;

        if (query) {
            content = contentQueries.search(query, type || undefined);
        } else {
            content = contentQueries.getAll(type || undefined, limit);
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

// POST /api/content - Create new content
export async function POST(request: NextRequest) {
    try {
        ensureDbInitialized();

        const body = await request.json();
        const { type, title, slug, description, content, tags, image, featured } = body;

        // Validate required fields
        if (!type || !title || !slug || !description || !content || !tags || !image) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate type
        if (type !== 'blog' && type !== 'project') {
            return NextResponse.json(
                { error: 'Invalid type. Must be "blog" or "project"' },
                { status: 400 }
            );
        }

        // If setting this post as featured, unset all other featured posts
        if ((featured === 1 || featured === true) && type === 'blog') {
            const allContent = contentQueries.getAll('blog');
            allContent.forEach((item: any) => {
                if (item.featured === 1) {
                    contentQueries.update(item.id, { featured: 0 });
                }
            });
        }

        const id = contentQueries.create({
            type,
            title,
            slug,
            description,
            content,
            tags,
            image,
            featured: featured || 0
        });

        return NextResponse.json(
            { id, message: 'Content created successfully' },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating content:', error);

        // Handle unique constraint violation (duplicate slug)
        if (error.message?.includes('UNIQUE constraint failed')) {
            return NextResponse.json(
                { error: 'A content item with this slug already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create content' },
            { status: 500 }
        );
    }
}
