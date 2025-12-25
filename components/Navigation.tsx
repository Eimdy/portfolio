"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Hide navigation on project detail pages
    if (pathname?.startsWith('/project/')) {
        return null;
    }

    const navLinks = [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#portfolio", label: "Portfolio" },
        { href: "#skills", label: "Skills" },
        { href: "#achievements", label: "Achievements" },
        { href: "#contact", label: "Contact" },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className="flex items-center justify-between px-6 py-6 md:px-12 border-b-2 border-black bg-white sticky top-0 z-50">
            {/* Logo - Left Side */}
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center border shadow group-hover:shadow-hover transition-all">
                    <span className="font-black text-xl">AM</span>
                </div>
            </div>

            {/* Right Side - Desktop Navigation & Mobile Button */}
            <div className="flex items-center">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            className="no-underline text-sm font-bold hover:text-black transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 border shadow active:shadow-hover transition-all"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-bottom md:hidden">
                    <div className="flex flex-col px-6 py-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className="text-sm font-bold py-3 border-bottom last:border-0 hover:text-black transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
