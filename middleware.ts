import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const { pathname } = request.nextUrl;

    // Define your subdomains here
    // Adjust these strings to match your actual domain
    const BLOG_SUBDOMAIN = 'blog';
    const CMS_SUBDOMAIN = 'cms';

    // Check if we are on a subdomain
    // Example: blog.eimd.my.id -> subdomain is 'blog'
    // Example: localhost:3000 -> subdomain is null (or check specifically for localhost)

    // Simple logic: Check if hostname STARTS with the subdomain
    // Ideally, you'd parse correctly, but for this use case:

    if (hostname.startsWith(BLOG_SUBDOMAIN + '.')) {
        // If user visits blog.domain.com/, rewrite to /blog
        // If user visits blog.domain.com/some-post, rewrite to /blog/some-post
        // BUT: Preventing infinite loops if the path is ALREADY /blog is tricky with rewrites sometimes.
        // Actually, for rewrites:
        // URL shown in browser: blog.domain.com
        // Next.js handles: /blog

        // If paths already start with /blog, we don't need to prepend it again if we are strict,
        // but typically a subdomain strategy means root of subdomain maps to sub-path.

        // We only rewrite if the path doesn't already start with /blog (to avoid /blog/blog)
        // AND we aren't requesting assets (_next, public files, etc)
        if (!pathname.startsWith('/blog') && !pathname.includes('.')) {
            return NextResponse.rewrite(new URL(`/blog${pathname}`, request.url));
        }
    }

    if (hostname.startsWith(CMS_SUBDOMAIN + '.')) {
        if (!pathname.startsWith('/cms') && !pathname.includes('.')) {
            return NextResponse.rewrite(new URL(`/cms${pathname}`, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
