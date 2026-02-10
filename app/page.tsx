"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";

export default function Home() {
    const [settings, setSettings] = useState({
        show_hero: true,
        show_about: true,
        show_skills: true,
        show_achievements: true,
        show_projects: true,
        show_blog: true,
        show_contact: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch('/api/settings');
                const data = await response.json();
                setSettings({
                    show_hero: data.show_hero ?? true,
                    show_about: data.show_about ?? true,
                    show_skills: data.show_skills ?? true,
                    show_achievements: data.show_achievements ?? true,
                    show_projects: data.show_projects ?? true,
                    show_blog: data.show_blog ?? true,
                    show_contact: data.show_contact ?? true
                });
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <>
                <Navigation />
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-neutral-500">Loading...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navigation />
            {settings.show_hero && <Hero />}
            {settings.show_about && <About />}
            {settings.show_skills && <Skills />}
            {settings.show_achievements && <Achievements />}
            {settings.show_projects && <Projects />}
            {settings.show_blog && <Blog />}
            {settings.show_contact && <Contact />}
        </>
    );
}
