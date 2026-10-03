import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { packageManifest } from "./src/package.manifest.ts";

const dirname = import.meta.dirname;

const libExternalPrefixes = packageManifest.libExternalPrefixes;

function isLibExternal(id: string): boolean {
  if (packageManifest.libExternals.includes(id as (typeof packageManifest.libExternals)[number])) {
    return true;
  }

  return libExternalPrefixes.some((prefix) => id.startsWith(prefix));
}

/**
 * Library build — React components only; styles ship via `dist/styles.css`.
 * One output module per source module, so an app that imports `Button` does not also
 * load the modules behind `TextSequence` (GSAP) or `RiveHand` (Rive).
 */
export default defineConfig({
  publicDir: false,
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(dirname, "src/index.ts"),
      formats: ["es"],
    },
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      external: isLibExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        /** Next App Router: components use client hooks (scroll, layout effects). */
        banner: '"use client";',
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
