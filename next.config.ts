import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://images.prd.kavak.io/**")],
  },
};

export default nextConfig;
