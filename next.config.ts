import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://images.prd.kavak.io/**"), new URL("https://photos.encuentra24.com/**")],
  },
};

export default nextConfig;
