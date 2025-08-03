import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  typescript: {
    ignoreBuildErrors: false,
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.0.102:3000",
  ],
  // Ignorar pasta de backup
 
};

export default nextConfig;
