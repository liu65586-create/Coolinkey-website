import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { uploadDevPlugin } from "./vite.upload-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), uploadDevPlugin()],
  optimizeDeps: {
    include: ["pdfjs-dist"],
  },
  worker: {
    format: "es",
  },
});
