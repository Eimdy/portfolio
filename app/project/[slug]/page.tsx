"use client";

import { useRouter } from "next/navigation";
import { EXTERNAL_LINKS } from "@/config/links";

interface ProjectDetailProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProjectDetail({ params }: ProjectDetailProps) {
    const router = useRouter();
    const { slug } = await params;

    // Dummy project data - in real app, fetch based on params.slug
    const project = {
        title: "FinTech Dashboard Analytics",
        author: "Andy Mahendra",
        date: "Oct 12, 2023",
        readTime: "5 min read",
        tags: ["React", "D3.js", "Tailwind"],
        heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
        description: "A comprehensive financial analytics platform designed to give traders and analysts real-time data visualization capabilities in a simplified, accessible interface.",
        challenge: "Financial data is notoriously dense. The primary challenge was to take millions of data points processed per second and render them in a way that doesn't overwhelm the user. The client needed a solution that was both performant and intuitive, moving away from legacy spreadsheet-style layouts to a modern, card-based dashboard.",
        projectDetails: {
            role: "Lead Frontend Developer",
            timeline: "3 Months",
            client: "FinTech Corp",
            status: "Live & Active"
        },
        solution: "We built a modular component system using React. By leveraging D3.js for custom visualizations, we were able to create highly specific charts that weren't available in off-the-shelf libraries. The backend communicates via WebSockets to push updates to the frontend in real-time without polling.",
        features: [
            { title: "Real-time updates", description: "WebSocket integration ensures data is always fresh (latency < 50ms)." },
            { title: "Custom visualizations", description: "Tailored D3 charts for specific financial indicators." },
            { title: "Responsive Design", description: "Fully functional on tablet and desktop devices." }
        ],
        gallery: [
            { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop", caption: "API Data Flow visualization" },
            { image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", caption: "Responsive mobile adaptation" }
        ],
        conclusion: "The final product reduced the time-to-insight for analysts by approximately 40%. The clean, paper-inspired UI was well received for reducing eye strain during long trading sessions.",
        liveUrl: EXTERNAL_LINKS.fintechLive,
        sourceUrl: EXTERNAL_LINKS.fintechSource
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/#portfolio")}
                        className="inline-flex items-center gap-5 text-sm font-bold text-neutral-500 hover:text-black transition-colors group px-4 py-2 border shadow hover:shadow-hover"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                            arrow_back
                        </span>
                        Back to Portfolio
                    </button>
                </div>

                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] mb-6">
                        {project.title}
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-black">
                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral-200 rounded-full overflow-hidden border-2 border-black">
                                <img
                                    alt={project.author}
                                    className="w-full h-full object-cover"
                                    src="https://media.licdn.com/dms/image/v2/D5603AQH2WnDSOeqwLg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1687758454631?e=1768435200&v=beta&t=tAv9Q9kmff8mV_MQxs0tLKB3FcNQRu11kZ6J0fwpWvs"
                                />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-black">{project.author}</p>
                                <p className="text-neutral-500">{project.date} · {project.readTime}</p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap">
                            {project.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs font-bold px-3 py-1 bg-neutral-100 text-black border-2 border-black rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Hero Image */}
                <figure className="mb-12">
                    <div className="w-full border shadow-large bg-neutral-100 overflow-hidden">
                        <img
                            alt={`${project.title} Preview`}
                            className="w-full h-auto object-cover aspect-video"
                            src={project.heroImage}
                        />
                    </div>
                    <figcaption className="mt-3 text-center text-sm text-neutral-500 italic">
                        Overview of the main dashboard analytics view
                    </figcaption>
                </figure>

                {/* Content */}
                <div className="prose prose-slate max-w-none">
                    {/* Description */}
                    <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-neutral-700">
                        {project.description}
                    </p>

                    {/* The Challenge */}
                    <h2 className="text-2xl font-black tracking-tight mt-12 mb-4">The Challenge</h2>
                    <p className="mb-6 leading-relaxed text-lg">
                        {project.challenge}
                    </p>

                    {/* Project Details Box */}
                    <div className="my-10 bg-neutral-50 p-6 md:p-8 border shadow border-l-8 border-l-black">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-black">info</span>
                            Project Details
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div>
                                <span className="block text-neutral-500 font-bold uppercase text-xs tracking-wider">Role</span>
                                <span className="font-medium">{project.projectDetails.role}</span>
                            </div>
                            <div>
                                <span className="block text-neutral-500 font-bold uppercase text-xs tracking-wider">Timeline</span>
                                <span className="font-medium">{project.projectDetails.timeline}</span>
                            </div>
                            <div>
                                <span className="block text-neutral-500 font-bold uppercase text-xs tracking-wider">Client</span>
                                <span className="font-medium">{project.projectDetails.client}</span>
                            </div>
                            <div>
                                <span className="block text-neutral-500 font-bold uppercase text-xs tracking-wider">Status</span>
                                <span className="font-black border-b-2 border-black inline-block leading-none">
                                    {project.projectDetails.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* The Solution */}
                    <h2 className="text-2xl font-black tracking-tight mt-12 mb-4">The Solution</h2>
                    <p className="mb-6 leading-relaxed text-lg">
                        {project.solution}
                    </p>

                    {/* Features List */}
                    <ul className="list-none space-y-3 mb-8 ml-0 pl-0">
                        {project.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-black shrink-0 mt-1">check_box</span>
                                <span>
                                    <strong>{feature.title}:</strong> {feature.description}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Visual Walkthrough */}
                    <h2 className="text-2xl font-black tracking-tight mt-12 mb-6">Visual Walkthrough</h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {project.gallery.map((item, index) => (
                            <div key={index} className="group">
                                <div className="border shadow bg-neutral-100 overflow-hidden mb-2">
                                    <img
                                        alt={item.caption}
                                        className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
                                        src={item.image}
                                    />
                                </div>
                                <p className="text-xs text-neutral-500">{item.caption}</p>
                            </div>
                        ))}
                    </div>

                    {/* Conclusion */}
                    <h2 className="text-2xl font-black tracking-tight mt-12 mb-4">Conclusion</h2>
                    <p className="mb-8 leading-relaxed text-lg">
                        {project.conclusion}
                    </p>

                    {/* CTA Section */}
                    <div className="mt-16 pt-8 border-t-2 border-black flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="text-center md:text-left">
                            <h3 className="font-bold text-xl mb-1">Ready to explore?</h3>
                            <p className="text-neutral-500 text-sm">Check out the live deployment or code.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button
                                onClick={() => window.open(project.liveUrl, '_blank', 'noopener,noreferrer')}
                                className="flex-1 md:flex-none text-center bg-black text-white px-8 py-3 font-bold border shadow hover:shadow-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                            >
                                Visit Site
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </button>
                            <button
                                onClick={() => window.open(project.sourceUrl, '_blank', 'noopener,noreferrer')}
                                className="flex-1 md:flex-none text-center bg-white text-black px-8 py-3 font-bold border shadow hover:shadow-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">code</span>
                                Source
                            </button>
                        </div>
                    </div>
                </div>

                {/* Previous/Next Navigation */}
                <div className="mt-20 grid grid-cols-2 gap-4">
                    <button
                        onClick={() => router.push("/project/social-connect")}
                        className="group block p-4 border-2 border-transparent hover:border-black hover:bg-neutral-50 transition-colors text-left"
                    >
                        <span className="text-xs font-bold text-neutral-400 mb-1 block group-hover:text-black">
                            Previous Project
                        </span>
                        <span className="font-bold text-lg leading-tight">Social Connect App</span>
                    </button>
                    <button
                        onClick={() => router.push("/project/ecommerce-api")}
                        className="group block p-4 border-2 border-transparent hover:border-black hover:bg-neutral-50 transition-colors text-right"
                    >
                        <span className="text-xs font-bold text-neutral-400 mb-1 block group-hover:text-black">
                            Next Project
                        </span>
                        <span className="font-bold text-lg leading-tight">E-Commerce API</span>
                    </button>
                </div>
            </article>

            {/* Footer */}
            <footer className="py-12 border-t-2 border-black bg-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <p className="text-sm font-bold text-neutral-500">
                        © 2024 Andy Mahendra. Built with digital paper & code.
                    </p>
                </div>
            </footer>
        </div>
    );
}
