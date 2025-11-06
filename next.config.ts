import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();
const sassOptions = {
  additionalData: `
    $var: red;
  `,
};

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  sassOptions: {
    ...sassOptions,
    implementation: "sass-embedded",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  // Note: Rewrites are not needed since we're using App Router API routes
  // The API route at /api/c15t/[...all] handles all c15t requests directly
};

export default withMDX(nextConfig);
