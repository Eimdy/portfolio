
// Route management for subdomain architecture
// Defaults to relative paths for localhost/monolith development
// Set NEXT_PUBLIC_... environment variables in production to enable subdomains

export const DOMAINS = {
    PORTFOLIO: process.env.NEXT_PUBLIC_PORTFOLIO_URL || '/',
    BLOG: process.env.NEXT_PUBLIC_BLOG_URL || '/blog',
    CMS: process.env.NEXT_PUBLIC_CMS_URL || '/cms',
};

export const ROUTES = {
    HOME: DOMAINS.PORTFOLIO,
    BLOG: DOMAINS.BLOG,
    CMS: DOMAINS.CMS,
};
