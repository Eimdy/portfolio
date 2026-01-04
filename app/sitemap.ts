import { MetadataRoute } from 'next';
import { contentQueries, initializeDatabase } from '@/lib/db';
import { ROUTES } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
    initializeDatabase();

    // Get all blog posts
    const posts = contentQueries.getAll('blog');

    const blogEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
        url: `${ROUTES.BLOG}/${post.slug}`,
        lastModified: new Date(post.createdAt),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: ROUTES.BLOG,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...blogEntries,
    ];
}
