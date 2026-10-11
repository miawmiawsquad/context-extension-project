import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The popup is a standard SPA (index.html). Static assets in /public
// (manifest.json, icons) are copied verbatim into /dist by Vite.
export default defineConfig({
  plugins: [react()],
  // Relative base so the popup's asset URLs resolve correctly from the
  // extension package root (chrome-extension://<id>/…).
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Keep output filenames stable/predictable for the extension bundle.
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
