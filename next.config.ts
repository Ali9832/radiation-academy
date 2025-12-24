/** @type {import('next').NextConfig} */
const nextConfig = {
    // این دو خط باعث می‌شود بیلد حتی با وجود ارور انجام شود
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

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
};

module.exports = nextConfig;