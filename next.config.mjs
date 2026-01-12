/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**.clerk.com" },
    ],
  },
  serverExternalPackages: ["pdf-parse", "tesseract.js"],
};

export default nextConfig;
