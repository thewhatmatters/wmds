import { copyFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from '@storybook/react-vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/**
 * RiveHand loads the Rive runtime from `/rive/rive.wasm` (`riveHandWasmSrc`).
 * Serve the build that matches the installed runtime — the copy is not checked in.
 */
const riveRuntime = createRequire(require.resolve("@rive-app/react-canvas")).resolve("@rive-app/canvas");
copyFileSync(
  path.join(path.dirname(riveRuntime), "rive.wasm"),
  path.join(dirname, "../public/rive/rive.wasm"),
);

const site = process.env.WMDS_SITE === "1";

const config: StorybookConfig = {
  staticDirs: ["../public"],
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  // The public site (WMDS_SITE=1, the Vercel build) ships only docs: the test, a11y, Chromatic and MCP
  // addons are for working on WMDS, and axe alone adds ~160 kB to every story a visitor opens.
  "addons": site
    ? ["@storybook/addon-docs"]
    : [
        "@chromatic-com/storybook",
        "@storybook/addon-vitest",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-mcp"
      ],
  core: { disableWhatsNewNotifications: site },
  "framework": "@storybook/react-vite"
};
export default config;
