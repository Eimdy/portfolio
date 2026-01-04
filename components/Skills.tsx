"use client";

import { useState, useEffect } from "react";

export default function Skills() {
    const [skills, setSkills] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch('/api/settings');
                const data = await response.json();
                setSkills(data.skills ?? []);
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    // Fallback skills if none in database
    const defaultSkills = [
        "Manual Testing",
        "Automation Testing",
        "Non-Functional Testing",
        "JavaScript",
        "Golang",
        "TypeScript",
        "Playwright",
        "Katalon",
        "Selenium",
        "CI/CD",
        "FIX Protocol",
        "AI Agent",
    ];

    const displaySkills = skills.length > 0 ? skills : defaultSkills;

    return (
        <>
            <div className="w-full h-0 border-t-2 border-black"></div>
            <section id="skills" className="px-6 py-16 md:px-12 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-black tracking-tight mb-4">
                        Skills & Technologies
                    </h2>
                    <p className="text-neutral-600 font-medium mb-12">
                        Technical expertise in quality assurance and test automation
                    </p>

                    {loading ? (
                        <p className="text-neutral-500">Loading skills...</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {displaySkills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="card bg-white p-4 border shadow hover:shadow-hover transition-all font-bold text-sm"
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
