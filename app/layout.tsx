import type { Metadata } from "next";
import { Patrick_Hand_SC } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PageLoader from "@/components/PageLoader";

const patrickHandSC = Patrick_Hand_SC({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Eimd",
    description: "Full-stack developer and UI enthusiast building digital sketches with a unique hand-drawn aesthetic.",
    keywords: ["portfolio", "developer", "web development", "full-stack"],
    authors: [{ name: "Andy Mahendra" }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://unpkg.com/papercss@1.9.2/dist/paper.min.css"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
                <Script
                    src="https://cdn.tailwindcss.com?plugins=forms,container-queries"
                    strategy="beforeInteractive"
                />
            </head>
            <body className={patrickHandSC.className}>
                <PageLoader>
                    <div className="bg-[#eeeeee] min-h-screen p-4 md:p-8 flex justify-center">
                        <main className="w-full max-w-[1200px] bg-white border shadow-large min-h-[90vh] flex flex-col relative overflow-hidden">
                            {children}
                        </main>
                    </div>
                </PageLoader>
            </body>
        </html>
    );
}
