// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: process.env.VITE_BASE_PATH || "/",
    build: {
      rolldownOptions: {
        output: {
          strictExecutionOrder: true,
          codeSplitting: {
            groups: [
              {
                name: "react-core",
                test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
                priority: 40,
              },
              {
                name: "motion",
                test: /node_modules[\\/](?:motion|framer-motion)[\\/]/,
                priority: 30,
              },
              {
                name: "tanstack",
                test: /node_modules[\\/]@tanstack[\\/]/,
                priority: 25,
              },
              {
                name: "ui-vendor",
                test: /node_modules[\\/](?:lucide-react|@radix-ui)[\\/]/,
                priority: 20,
              },
              {
                name: "vendor",
                test: /node_modules/,
                minSize: 20_000,
                maxSize: 250_000,
                priority: 10,
              },
            ],
          },
        },
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
