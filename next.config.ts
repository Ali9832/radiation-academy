import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fatehi.ipapda.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
  reactCompiler: true,
};

module.exports = nextConfig;
