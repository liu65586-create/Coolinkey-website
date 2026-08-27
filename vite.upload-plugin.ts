import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/** Dev-only: PUT /api/upload?path=uploads/foo.webp writes raw bytes into public/. */
export function uploadDevPlugin(): Plugin {
  return {
    name: "coolinkey-upload-dev",
    configureServer(server) {
      server.middlewares.use("/api/upload", (req, res, next) => {
        if (req.method !== "PUT") return next();

        const relParam = new URL(req.url ?? "", "http://local").searchParams.get("path") ?? "";
        const rel = relParam.replace(/^\/+/, "");
        if (!rel.startsWith("uploads/") && !rel.startsWith("images/") && !rel.startsWith("manuals/")) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Path must be under uploads/, images/, or manuals/" }));
          return;
        }
        if (rel.includes("..")) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Invalid path" }));
          return;
        }

        const chunks: Buffer[] = [];
        req.on("data", (c) => chunks.push(Buffer.from(c)));
        req.on("end", () => {
          try {
            const outPath = path.join(server.config.root, "public", rel);
            fs.mkdirSync(path.dirname(outPath), { recursive: true });
            fs.writeFileSync(outPath, Buffer.concat(chunks));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, path: `/${rel}` }));
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Upload failed" }));
          }
        });
      });
    },
  };
}
