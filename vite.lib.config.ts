import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { packageManifest } from "./src/package.manifest.ts";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const libExternalPrefixes = packageManifest.libExternalPrefixes;

function isLibExternal(id: string): boolean {
  if (packageManifest.libExternals.includes(id as (typeof packageManifest.libExternals)[number])) {
    return true;
  }

  return libExternalPrefixes.some((prefix) => id.startsWith(prefix));
}

/** Library bundle — React components only; styles ship via `dist/styles.css`. */
export default defineConfig({
  publicDir: false,
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      external: isLibExternal,
      output: {
        preserveModules: false,
      },
      plugins: [
        {
          name: "externalize-css",
          resolveId(source) {
            if (source.endsWith(".css")) {
              return { id: source, external: true };
            }
            return null;
          },
        },
      ],
    },
  },
});
