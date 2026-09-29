/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/rapier", "meshline"],
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    config.output = config.output || {};
    config.output.chunkLoadTimeout = 300000;
    return config;
  },
};

module.exports = nextConfig;
