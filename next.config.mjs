/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,

  async rewrites() {
    return [
      {
        source: "/chatHub/:path*",
        destination: "https://api.dolox.ir/chatHub/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
