/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ✅ Tắt strict mode
  images: {
    domains: [
      "res.cloudinary.com",
      "www.carmudi.vn",
      "down-vn.img.susercontent.com",
    ],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 64, 96, 128, 256, 384, 512, 768, 1024, 1280],
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
