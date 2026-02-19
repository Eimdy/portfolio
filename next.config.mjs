/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'media.licdn.com'],
        formats: ['image/avif', 'image/webp'],
    },
    // Enable compression
    compress: true,
    // Optimize production builds
    // Enable React strict mode for better performance
    reactStrictMode: true,
    // Allow large file uploads (for video up to 100MB)
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
};

export default nextConfig;
