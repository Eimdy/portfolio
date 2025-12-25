"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Projects() {
    const router = useRouter();
    const projects = [
        {
            title: "FinTech Dashboard",
            slug: "fintech-dashboard",
            description:
                "A comprehensive financial analytics platform with real-time data visualization.",
            tech: ["React", "D3.js"],
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        },
        {
            title: "Social Connect App",
            slug: "social-connect",
            description:
                "Mobile-first social networking application focused on community building.",
            tech: ["Flutter", "Firebase"],
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
        },
        {
            title: "E-Commerce API",
            slug: "ecommerce-api",
            description:
                "High-performance RESTful API for a multi-vendor marketplace platform.",
            tech: ["Node.js", "MongoDB"],
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        },
    ];

    return (
        <>
            <div className="w-full h-0 border-top"></div>
            <section id="portfolio" className="px-6 py-16 md:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-neutral-100 text-black flex items-center justify-center border shadow rounded-full">
                                <span className="material-symbols-outlined">grid_view</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">Portfolio</h2>
                                <p className="text-neutral-500 font-medium">
                                    Selected works from 2023-2024
                                </p>
                            </div>
                        </div>
                        <a
                            href="#"
                            className="text-black font-bold hover:underline flex items-center gap-1"
                        >
                            View Github{" "}
                            <span className="material-symbols-outlined text-sm">
                                open_in_new
                            </span>
                        </a>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="card group flex flex-col bg-white border shadow hover:shadow-large hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Project Image */}
                                <div className="h-48 overflow-hidden border-bottom bg-neutral-100">
                                    <img
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        src={project.image}
                                    />
                                </div>

                                {/* Project Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                    <p className="text-sm text-neutral-600 mb-4 flex-1">
                                        {project.description}
                                    </p>

                                    {/* Tech Tags */}
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {project.tech.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="badge text-xs font-bold px-2 py-1 bg-neutral-100 text-black"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* View Button */}
                                    <button
                                        onClick={() => router.push(`/project/${project.slug}`)}
                                        className="btn-small w-full py-2 border font-bold text-sm hover:bg-neutral-100 transition-colors text-center"
                                    >
                                        View Project
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
