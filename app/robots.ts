
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: ['/blog', '/blog/*'],
            disallow: '/',
        },
        sitemap: 'https://andy-mahendra.portfolio/sitemap.xml', // Replace with actual domain in production
    };
}
