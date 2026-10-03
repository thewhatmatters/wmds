import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Same as create-next-app 16.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    // Show code is framework-neutral: images are plain <img> so the same code runs in Storybook (Vite)
    // and in Next. In a Next app, swapping <img> for next/image is an allowed edit (skills/use-wmds).
    files: ["patterns/**"],
    rules: { "@next/next/no-img-element": "off" },
  },
]);

export default eslintConfig;
