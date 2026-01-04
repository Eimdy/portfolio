/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'media.licdn.com'],
        formats: ['image/avif', 'image/webp'],
    },
    // Enable compression
    compress: true,
    // Optimize production builds
    swcMinify: true,
    // Enable React strict mode for better performance
    reactStrictMode: true,
    // Optimize fonts
    optimizeFonts: true,
};

export default nextConfig;
