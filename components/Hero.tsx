"use client";

import { useState, useEffect } from "react";

export default function Hero() {
    const [settings, setSettings] = useState({
        ready_for_hire: true,
        ready_for_hire_text: 'Available for hire!',
        job_title: 'Software Engineer in Test',
        job_description: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch('/api/settings');
                const data = await response.json();
                setSettings({
                    ready_for_hire: data.ready_for_hire ?? true,
                    ready_for_hire_text: data.ready_for_hire_text ?? 'Available for hire!',
                    job_title: data.job_title ?? 'Software Engineer in Test',
                    job_description: data.job_description ?? ''
                });
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    return (
        <section
            id="home"
            className="px-6 py-12 md:px-12 md:py-20 flex flex-col md:flex-row gap-10 md:gap-16 items-center"
        >
            {/* Profile Image */}
            <div className="relative shrink-0">
                <div className="w-48 h-48 md:w-64 md:h-64 border shadow overflow-hidden bg-neutral-200">
                    <img
                        alt="Portrait of developer"
                        className="w-full h-full object-cover"
                        src="/image.jpg"
                    />
                </div>
                {settings.ready_for_hire && (
                    <div className="absolute -bottom-4 -right-4 bg-black text-white px-3 py-1 border shadow text-xs font-bold rotate-[-3deg]">
                        {settings.ready_for_hire_text}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="max-w-2xl text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] mb-6">
                    Hi, I&apos;m{" "}
                    <span className="inline-block">
                        Andy Mahendra
                    </span>
                </h1>
                <p className="text-xl md:text-2xl font-medium mb-4 text-neutral-700">
                    {settings.job_title}
                </p>
                {!loading && settings.job_description && (
                    <p className="text-lg text-neutral-600 leading-relaxed whitespace-pre-line">
                        {settings.job_description}
                    </p>
                )}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                    <button
                        onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn-small bg-black text-white px-7 py-3 font-bold border shadow hover:bg-neutral-800 transition-colors flex items-center gap-2"
                    >
                        View Work
                        <span className="material-symbols-outlined text-sm">
                            arrow_forward
                        </span>
                    </button>
                    <button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn-small bg-white text-black px-7 py-3 font-bold border shadow hover:bg-neutral-100 transition-colors"
                    >
                        Contact Me
                    </button>
                </div>
            </div>
        </section>
    );
}
