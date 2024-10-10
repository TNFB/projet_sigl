/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    assetPrefix: isProd ? '/projet_sigl/' : '',
    basePath: isProd ? '/projet_sigl' : '',
    trailingSlash: true,
    output: 'export',
};

export default nextConfig;
