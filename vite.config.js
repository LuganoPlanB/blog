import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  publicDir: false,
  build: {
    outDir: "assets/generated",
    emptyOutDir: true,
    copyPublicDir: false,
    cssCodeSplit: false,
    lib: {
      entry: resolve(import.meta.dirname, "frontend/main.js"),
      formats: ["es"],
      fileName: () => "blog.js",
      cssFileName: "blog",
    },
    rollupOptions: {
      output: {
        assetFileNames: (asset) =>
          asset.names?.some((name) => name.endsWith(".css"))
            ? "blog.css"
            : "[name][extname]",
      },
    },
  },
});
