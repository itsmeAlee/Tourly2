/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better debugging
    reactStrictMode: true,

    // Image optimization configuration
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
        unoptimized: false,
    },
};

export default nextConfig;
