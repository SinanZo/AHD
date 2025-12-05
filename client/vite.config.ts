import path from "node:path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async () => {
  const isTest = !!process.env.VITEST;

  // Dynamically import ESM-only plugins only when not running Vitest. This
  // avoids esbuild/require errors when Vitest loads the Vite config.
  const plugins = [] as any[];
  if (!isTest) {
    const react = (await import('@vitejs/plugin-react')).default;
    const tailwindcss = (await import('@tailwindcss/vite')).default;
    plugins.push(react(), tailwindcss());
  }

  return {
    root: path.resolve(__dirname),
    envDir: path.resolve(__dirname),
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@shared": path.resolve(__dirname, "..", "shared"),
        "@assets": path.resolve(__dirname, "..", "attached_assets"),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      proxy: {
        '/api': {
          // Pin to stable backend port for dev
          target: 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
        },
      },
      fs: {
        // allow the monorepo root so imports from /shared work
        allow: [path.resolve(__dirname, "..")],
      },
    },
    build: {
      outDir: path.resolve(__dirname, "..", "dist", "public"),
      emptyOutDir: true,
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/setupTests.ts"],
      coverage: { reporter: ["text", "lcov"] },
    },
  };
});
