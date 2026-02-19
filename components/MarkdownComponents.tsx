import React from 'react';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov'];
const ALIGNMENTS = ['left', 'center', 'right'] as const;
type Alignment = typeof ALIGNMENTS[number];

/**
 * Parse alt text for custom size and alignment:
 *   "alt|400x300"         → size only
 *   "alt|center"          → align only
 *   "alt|400x300|center"  → size + align
 *   "alt|400|right"       → width + align
 */
function parseAltText(alt: string): { altText: string; width?: number; height?: number; align?: Alignment } {
    const parts = alt.split('|').map(s => s.trim());
    const altText = parts[0] || alt;
    let width: number | undefined;
    let height: number | undefined;
    let align: Alignment | undefined;

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i].toLowerCase();
        if (ALIGNMENTS.includes(part as Alignment)) {
            align = part as Alignment;
        } else {
            const sizeMatch = part.match(/^(\d+)(?:x(\d+))?$/);
            if (sizeMatch) {
                width = parseInt(sizeMatch[1]);
                height = sizeMatch[2] ? parseInt(sizeMatch[2]) : undefined;
            }
        }
    }

    return { altText, width, height, align };
}

/**
 * Check if a URL points to a video file
 */
function isVideoUrl(src: string): boolean {
    const url = src.toLowerCase().split('?')[0];
    return VIDEO_EXTENSIONS.some(ext => url.endsWith(ext));
}

const ALIGN_STYLES: Record<Alignment, React.CSSProperties> = {
    left: { display: 'flex', justifyContent: 'flex-start' },
    center: { display: 'flex', justifyContent: 'center' },
    right: { display: 'flex', justifyContent: 'flex-end' },
};

/**
 * Custom image component for ReactMarkdown that:
 * - Renders video files as <video> player
 * - Supports custom sizing: ![alt|WIDTHxHEIGHT](src)
 * - Supports alignment: ![alt|center](src) or ![alt|400x300|right](src)
 * - Renders images with responsive styling
 */
export function MarkdownImage({ node, src, alt, width: _w, height: _h, style: _s, ...props }: any) {
    if (!src) return null;

    const { altText, width, height, align } = parseAltText(alt || '');

    let element: React.ReactNode;

    if (isVideoUrl(src)) {
        element = (
            <video
                src={src}
                controls
                style={
                    width || height
                        ? { width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined, maxWidth: '100%' }
                        : { width: '100%', maxWidth: '100%' }
                }
                className="my-4 rounded"
                title={altText}
            >
                {altText || 'Your browser does not support the video tag.'}
            </video>
        );
    } else {
        element = (
            <img
                src={src}
                alt={altText}
                style={
                    width || height
                        ? { width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined, maxWidth: '100%' }
                        : { maxWidth: '100%' }
                }
                className="my-4 rounded"
                loading="lazy"
            />
        );
    }

    if (align) {
        return <div style={ALIGN_STYLES[align]}>{element}</div>;
    }

    return element;
}

/**
 * Shared markdown component overrides for ReactMarkdown.
 * Use with: <ReactMarkdown components={markdownComponents}>
 */
export const markdownComponents = {
    h1: ({ node, ...props }: any) => <h1 className="text-3xl font-black mt-8 mb-4 border-b-2 border-black pb-2" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
    p: ({ node, children, ...props }: any) => <div className="mb-4 text-neutral-700 leading-relaxed" {...props}>{children}</div>,
    a: ({ node, ...props }: any) => <a className="text-black font-bold underline hover:no-underline" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
    li: ({ node, ...props }: any) => <li className="text-neutral-700" {...props} />,
    code: ({ node, inline, ...props }: any) =>
        inline ? (
            <code className="bg-neutral-100 px-2 py-1 rounded font-mono text-sm border" {...props} />
        ) : (
            <code className="block bg-neutral-900 text-white p-4 rounded font-mono text-sm overflow-x-auto mb-4 border-2 border-black" {...props} />
        ),
    pre: ({ node, ...props }: any) => <pre className="mb-4" {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-black pl-4 italic my-4 text-neutral-600" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="font-black" {...props} />,
    em: ({ node, ...props }: any) => <em className="italic" {...props} />,
    img: MarkdownImage,
};
