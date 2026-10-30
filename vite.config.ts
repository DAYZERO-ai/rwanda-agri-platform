import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import checker from "vite-plugin-checker";
// @ts-expect-error - No type declarations for custom plugin
import clearLogPlugin from "./dala-internal-vite-clear-log-plugin.js";

import dns from "node:dns";

dns.setDefaultResultOrder("verbatim");

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built bundle (dist/index.html + assets) can be opened
  // from any folder, sub-path, or static file server without missing-asset 404s.
  base: "./",
  plugins: [
    clearLogPlugin(),
    react(),
    tailwindcss(),
    checker({
      typescript: true,
    }),
  ],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    cors: true,
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
    cors: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 5000, // Increases the limit to 5MB
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        home: path.resolve(__dirname, "home.html"),
      },
      output: {
        // Keep filenames stable so dist/ can be copied and served from anywhere.
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
});