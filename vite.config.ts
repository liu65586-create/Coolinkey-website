import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { handleAdminApi } from "./server/adminHttp.mjs";

function adminApiPlugin(): Plugin {
  return {
    name: "coolinkey-admin-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || "").split("?")[0];
        if (!pathname.startsWith("/api/")) return next();
        try {
          await handleAdminApi(req, res, pathname);
        } catch (error) {
          res.statusCode = 500;
          res.end(error instanceof Error ? error.message : "admin api failed");
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of ["ADMIN_PASSWORD", "GITHUB_TOKEN", "GITHUB_REPO", "GITHUB_BRANCH", "ADMIN_SESSION_SECRET"]) {
    if (!process.env[key] && env[key]) process.env[key] = env[key];
  }
  return {
  plugins: [react(), tailwindcss(), adminApiPlugin()],
  optimizeDeps: {
    include: ["pdfjs-dist"],
  },
  worker: {
    format: "es",
  },
};
});
