import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  // Include native modules for Tailwind CSS v4
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/lightningcss/**/*",
      "./node_modules/lightningcss-linux-x64-gnu/**/*",
      "./node_modules/@tailwindcss/oxide/**/*",
      "./node_modules/@tailwindcss/oxide-linux-x64-gnu/**/*",
    ],
  },
  // Note: Rewrites are not needed since we're using App Router API routes
  // The API route at /api/c15t/[...all] handles all c15t requests directly
};

export default withMDX(nextConfig);
