"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ROUTES } from "@/lib/routes";

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    description: string;
    tags: string;
    image: string;
    createdAt: string;
}

export default function Blog() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('/api/content?type=blog&limit=3');
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

    // Memoize posts to prevent unnecessary re-renders
    const displayPosts = useMemo(() => posts.slice(0, 3), [posts]);

    return (
        <>
            <div className="w-full h-0 border-t-2 border-black"></div>
            <section id="blog" className="px-6 py-16 md:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-neutral-100 text-black flex items-center justify-center border shadow rounded-full">
                                <span className="material-symbols-outlined">article</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">Blog</h2>
                            </div>
                        </div>
                        <a
                            href={ROUTES.BLOG}
                            className="text-black font-bold hover:underline flex items-center gap-1 !border-0 !shadow-none !bg-transparent p-0"
                        >
                            View All Posts{" "}
                            <span className="material-symbols-outlined text-sm">
                                open_in_new
                            </span>
                        </a>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-neutral-500">Loading blog posts...</p>
                        </div>
                    ) : (
                        /* Blog Posts Grid */
                        <div className="grid md:grid-cols-3 gap-8">
                            {displayPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="card group flex flex-col bg-white border shadow hover:shadow-large hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Post Image */}
                                    <div className="h-48 overflow-hidden border-b border-black bg-neutral-100">
                                        <img
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            src={post.image}
                                        />
                                    </div>

                                    {/* Post Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                        <p className="text-sm text-neutral-600 mb-4 flex-1">
                                            {post.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            {post.tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="badge text-xs font-bold px-2 py-1 bg-neutral-100 text-black"
                                                >
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Read More Button */}
                                        <a
                                            href={`${ROUTES.BLOG}/${post.slug}`}
                                            className="btn-small w-full py-2 border font-bold text-sm hover:bg-neutral-100 transition-colors text-center block"
                                        >
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
