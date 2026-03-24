import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Zego (WebRTC SDK) is incompatible with Strict Mode double-mount
};

export default nextConfig;
