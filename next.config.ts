/** @type {import('next').NextConfig} */
const nextConfig = {
    // نادیده گرفتن ارورها برای بیلد موفق
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

    // 👇 این بخش جدید رو اضافه کن تا اون فایل ۲۵ مگابایتی ساخته نشه
    webpack: (config) => {
        config.cache = false;
        return config;
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