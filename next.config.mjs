/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better debugging
    reactStrictMode: true,

    // Image optimization configuration
    images: {
        remotePatterns: [],
        unoptimized: false,
    },
};

export default nextConfig;
