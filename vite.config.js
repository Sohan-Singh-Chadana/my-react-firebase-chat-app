import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "pdf.worker": ["pdfjs-dist/build/pdf.worker.entry"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "pdfjs-dist/build/pdf.worker.entry":
        "/node_modules/pdfjs-dist/build/pdf.worker.entry.js",
    },
  },
});
