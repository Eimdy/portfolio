"use client";

import { useState, useEffect } from "react";

interface AboutSkill {
    icon: string;
    title: string;
    tech: string;
}

export default function About() {
    const [aboutMe, setAboutMe] = useState('');
    const [aboutSkills, setAboutSkills] = useState<AboutSkill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch('/api/settings');
                const data = await response.json();
                setAboutMe(data.about_me ?? '');
                setAboutSkills(data.about_skills ?? []);
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    // Fallback skills if none in database (or during loading if preferred to show default)
    const defaultSkills = [
        {
            icon: "bug_report",
            title: "Manual Testing",
            tech: "Test Cases, Bug Tracking",
        },
        {
            icon: "smart_toy",
            title: "Automation",
            tech: "Playwright, Katalon",
        },
        {
            icon: "code",
            title: "Programming",
            tech: "JavaScript, Golang",
        },
        {
            icon: "integration_instructions",
            title: "CI/CD & DevOps",
            tech: "Pipelines, FIX Protocol",
        },
    ];

    const displaySkills = aboutSkills.length > 0 ? aboutSkills : defaultSkills;

    return (
        <>
            <div className="w-full h-0 border-t-2 border-black"></div>
            <section
                id="about"
                className="px-6 py-16 md:px-12 bg-neutral-50"
            >
                <div className="max-w-4xl mx-auto">
                    {/* Section Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-neutral-100 text-black flex items-center justify-center border shadow rounded-full">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">About Me</h2>
                    </div>

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {/* Description */}
                        <div className="space-y-4 text-neutral-700 font-medium">
                            {!loading && aboutMe ? (
                                <p className="whitespace-pre-line">{aboutMe}</p>
                            ) : (
                                <>
                                    <p>
                                        I&apos;m a Software Engineer in Test with over 3 years of experience
                                        in ensuring software quality through comprehensive testing strategies.
                                        My expertise spans across manual testing, automation testing, and
                                        non-functional testing.
                                    </p>
                                    <p>
                                        I specialize in building robust test automation frameworks using
                                        JavaScript and Golang, with hands-on experience in CI/CD pipelines
                                        and cutting-edge AI Agent testing solutions.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {displaySkills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 border shadow flex flex-col gap-2"
                                >
                                    <span className="material-symbols-outlined text-black">
                                        {skill.icon}
                                    </span>
                                    <span className="font-bold">{skill.title}</span>
                                    <span className="text-xs text-neutral-500">{skill.tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
