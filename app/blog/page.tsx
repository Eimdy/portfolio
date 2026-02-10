"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogNavigation from "@/components/BlogNavigation";
import { ROUTES } from "@/lib/routes";

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    description: string;
    tags: string;
    image: string;
    createdAt: string;
    featured?: number;
}

export default function AllBlogsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('/api/content?type=blog');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    // Get featured post (only if explicitly marked as featured)
    const featuredPost = posts.find(p => p.featured === 1);
    // If there's a featured post, exclude it from other posts. Otherwise show all posts
    const otherPosts = featuredPost ? posts.filter(p => p.id !== featuredPost.id) : posts;

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <BlogNavigation />

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-12 md:px-12">
                {/* Page Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">Blog</h1>
                    <p className="text-lg text-neutral-600 font-medium max-w-2xl mx-auto">
                        A QA&apos;s perspective on tech, tools, and the world around us.
                    </p>
                    {!loading && (
                        <p className="text-sm text-neutral-500 mt-4">
                            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-500">Loading articles...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white border-2 border-black shadow">
                        <p className="text-neutral-500 p-8">No articles found yet. Check back soon!</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        {featuredPost && (
                            <div className="mb-16">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-sm">star</span>
                                    <span className="text-sm font-bold uppercase tracking-wider">Featured Article</span>
                                </div>
                                <a
                                    href={`${ROUTES.BLOG}/${featuredPost.slug}`}
                                    className="block group cursor-pointer bg-white shadow-large hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="grid md:grid-cols-2 gap-0">
                                        {/* Image */}
                                        <div className="h-64 md:h-96 bg-neutral-100">
                                            <img
                                                src={featuredPost.image}
                                                alt={featuredPost.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        {/* Content */}
                                        <div className="p-8 md:p-10 flex flex-col justify-center">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {featuredPost.tags.split(',').slice(0, 2).map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="badge text-xs font-bold px-3 py-1 bg-neutral-800 text-white"
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-black mb-4 group-hover:underline">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
                                                {featuredPost.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm font-bold">
                                                Read Article
                                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                                    arrow_forward
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        )}

                        {/* Other Posts - List View */}
                        {otherPosts.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
                                    <span className="material-symbols-outlined">article</span>
                                    All Articles
                                </h2>
                                <div className="space-y-6">
                                    {otherPosts.map((post) => (
                                        <a
                                            key={post.id}
                                            href={`${ROUTES.BLOG}/${post.slug}`}
                                            className="block group cursor-pointer bg-white shadow hover:shadow-large hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="grid md:grid-cols-4 gap-0">
                                                {/* Image */}
                                                <div className="h-48 md:h-full bg-neutral-100">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                                {/* Content */}
                                                <div className="md:col-span-3 p-6">
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {post.tags.split(',').slice(0, 3).map((tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="badge text-xs font-bold px-2 py-1 bg-neutral-800 text-white"
                                                            >
                                                                {tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <h3 className="text-2xl font-black mb-2 group-hover:underline">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-neutral-600 mb-4 leading-relaxed">
                                                        {post.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm font-bold">
                                                        Read More
                                                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                                            arrow_forward
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t-2 border-black mt-20 py-8 bg-white">
                <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
                    <p className="text-sm text-neutral-600">
                        © 2024 Andy Mahendra. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
