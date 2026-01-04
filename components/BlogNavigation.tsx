"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function BlogNavigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: ROUTES.HOME, label: "Portfolio", external: true },
    ];

    return (
        <header className="flex items-center justify-between px-6 py-6 md:px-12 bg-white sticky top-0 z-50 shadow">
            {/* Logo - Left Side */}
            <Link
                href="/blog"
                className="flex items-center gap-3 group cursor-pointer !no-underline"
                style={{ backgroundImage: 'none' }}
            >
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center border shadow group-hover:shadow-hover transition-all">
                    <span className="font-black text-xl">AM</span>
                </div>
                <div className="hidden md:block">
                    <div className="font-black text-lg">Blog</div>
                    <div className="text-xs text-neutral-600">Thoughts & Tutorials</div>
                </div>
            </Link>

            {/* Right Side - Desktop Navigation & Mobile Button */}
            <div className="flex items-center">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="no-underline text-sm font-bold hover:text-black transition-colors flex items-center gap-1"
                        >
                            {link.label}
                            {link.external && (
                                <span className="material-symbols-outlined text-xs">
                                    open_in_new
                                </span>
                            )}
                        </Link>
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
                <div className="absolute top-full left-0 right-0 bg-white border-b-2 border-black shadow-large md:hidden">
                    <div className="flex flex-col px-6 py-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-bold py-3 border-b border-neutral-300 last:border-0 hover:text-black transition-colors flex items-center justify-between"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                                {link.external && (
                                    <span className="material-symbols-outlined text-xs">
                                        open_in_new
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
