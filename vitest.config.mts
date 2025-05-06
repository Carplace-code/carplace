import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@/app": "app",
      "@/components": "components",
      "@/hooks": "hooks",
      "@/lib": "lib",
      "@/utils": "utils",
    },
  },
  test: {
    sequence: {
      hooks: "parallel",
    },
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    coverage: {
      exclude: ["node_modules", "**/__tests__/**", "**/*.css"],
      include: ["app", "components", "hooks", "utils"],
      reporter: ["text", "json", "json-summary", "html"],
      reportOnFailure: true,
      thresholds: {
        global: {
          statements: 69,
          branches: 81,
          functions: 69,
          lines: 69,
        },
      },
    },
  },
});
