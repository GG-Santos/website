import path from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@shadcn": path.resolve(__dirname, "./src/components/ui"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@server": path.resolve(__dirname, "./src/server"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@test": path.resolve(__dirname, "./test"),
    },
  },
});
