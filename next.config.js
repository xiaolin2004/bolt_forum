/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
};

module.exports = nextConfig;

// next.config.js
module.exports = {
  images: {
    dangerouslyAllowSVG: true, // 允许渲染 SVG
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/pixel-art/svg", // 匹配你的 SVG URL
      },
    ],
  },
};
