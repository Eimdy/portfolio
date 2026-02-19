
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BlogNavigation from "@/components/BlogNavigation";
import { contentQueries, initializeDatabase } from "@/lib/db";
import Link from "next/link";
import { Metadata } from "next";
import { ROUTES } from "@/lib/routes";
import { markdownComponents } from "@/components/MarkdownComponents";

// Force database initialization in server component context
initializeDatabase();

interface BlogPost {
    id: number;
    type: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    tags: string;
    image: string;
    createdAt: string;
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = contentQueries.getBySlug(slug) as BlogPost;

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} - Andy Mahendra Blog`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.createdAt,
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            tags: post.tags.split(',').map(tag => tag.trim()),
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: [post.image],
        },
    };
}

export default async function BlogDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const post = contentQueries.getBySlug(slug) as BlogPost;

    if (!post) {
        return (
            <div className="min-h-screen bg-white">
                <BlogNavigation />
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <h1 className="text-3xl font-black">Blog Post Not Found</h1>
                    <a
                        href={ROUTES.BLOG}
                        className="btn border px-6 py-2 font-bold hover:bg-neutral-100"
                    >
                        View All Posts
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header with Back Button */}
            <BlogNavigation />

            {/* Hero Image */}
            <div className="w-full h-64 md:h-96">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale-0"
                />
            </div>

            {/* Content */}
            <article className="max-w-3xl mx-auto px-6 py-12 md:px-12">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black mb-4">{post.title}</h1>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.split(',').map((tag, index) => (
                        <span
                            key={index}
                            className="badge text-xs font-bold px-3 py-1 bg-neutral-100 text-black border"
                        >
                            {tag.trim()}
                        </span>
                    ))}
                </div>

                {/* Description */}
                <p className="text-xl text-neutral-600 mb-8 font-medium border-l-4 border-black pl-4">
                    {post.description}
                </p>

                {/* Markdown Content */}
                <div className="prose prose-lg max-w-none markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Back Button */}
                <div className="mt-12 pt-8 border-t-2 border-black">
                    <a
                        href={ROUTES.BLOG}
                        className="btn border px-6 py-3 font-bold hover:bg-neutral-100 transition-colors inline-block"
                        style={{ backgroundImage: 'none' }}
                    >
                        ← Back to All Posts
                    </a>
                </div>
            </article>
        </div>
    );
}
