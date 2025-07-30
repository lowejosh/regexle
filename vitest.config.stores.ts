import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: [
      "src/tests/**/*.test.ts",
      "src/tests/**/*.spec.ts",
    ],
    exclude: [
      "src/tests/puzzle-validation.test.ts",
      "src/tests/validation-report.test.ts",
      "src/tests/stores/themeStore.test.ts", // Temporarily exclude due to import-time execution
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
