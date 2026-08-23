import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

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
      external: ["react", "react-dom", "react/jsx-runtime", "recharts"],
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
