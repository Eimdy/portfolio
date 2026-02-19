"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ROUTES } from "@/lib/routes";
import { markdownComponents } from "@/components/MarkdownComponents";

interface ProjectDetailProps {
    params: Promise<{
        slug: string;
    }>;
}

interface Project {
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

export default function ProjectDetail({ params }: ProjectDetailProps) {
    const router = useRouter();
    const [slug, setSlug] = useState<string>("");
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        params.then((p) => setSlug(p.slug));
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        async function fetchProject() {
            try {
                const response = await fetch(`/api/content?type=project`);
                const projects = await response.json();
                const foundProject = projects.find((p: Project) => p.slug === slug);
                setProject(foundProject || null);
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center py-20">
                    <p className="text-neutral-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <h1 className="text-3xl font-black">Project Not Found</h1>
                    <a
                        href={`${ROUTES.HOME}/#portfolio`}
                        className="btn border px-6 py-2 font-bold hover:bg-neutral-100"
                    >
                        Back to Portfolio
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image */}
            <div className="w-full h-64 md:h-96">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale-0"
                />
            </div>

            {/* Content */}
            <article className="max-w-3xl mx-auto px-6 py-12 md:px-12">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black mb-4">{project.title}</h1>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.split(',').map((tag, index) => (
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
                    {project.description}
                </p>

                {/* Markdown Content */}
                <div className="prose prose-lg max-w-none markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {project.content}
                    </ReactMarkdown>
                </div>

                {/* Back Button */}
                <div className="mt-12 pt-8 border-t-2 border-black">
                    <a
                        href={`${ROUTES.HOME}/#portfolio`}
                        className="btn border px-6 py-3 font-bold hover:bg-neutral-100 transition-colors inline-block"
                        style={{ backgroundImage: 'none' }}
                    >
                        ← Back to Portfolio
                    </a>
                </div>
            </article>
        </div>
    );
}
