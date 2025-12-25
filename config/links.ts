// External Links Configuration
// Replace these placeholder URLs with your actual links

export const EXTERNAL_LINKS = {
    // Social Media
    linkedin: "https://linkedin.com/in/YOUR_LINKEDIN_USERNAME",
    github: "https://github.com/YOUR_GITHUB_USERNAME",

    // Project Links - FinTech Dashboard
    fintechLive: "https://your-fintech-project-url.com",
    fintechSource: "https://github.com/YOUR_USERNAME/fintech-dashboard",

    // Project Links - Social Connect
    socialConnectLive: "https://your-social-connect-url.com",
    socialConnectSource: "https://github.com/YOUR_USERNAME/social-connect",

    // Project Links - E-Commerce API
    ecommerceLive: "https://your-ecommerce-url.com",
    ecommerceSource: "https://github.com/YOUR_USERNAME/ecommerce-api",

    // Other Links
    email: "mailto:your.email@example.com",
    resume: "/path-to-your-resume.pdf",
} as const;

export type ExternalLinkKey = keyof typeof EXTERNAL_LINKS;
