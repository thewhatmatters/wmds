import type { Preview } from "@storybook/react-vite";
import { MotionConfig } from "motion/react";
import { storybookViewports } from "../src/lib/viewports";
import "../src/styles/global.css";
import "./docs.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Light or dark token set",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    viewport: {
      description: "WMDS viewport tier — matches Tailwind breakpoints in src/lib/viewports.ts",
      toolbar: {
        title: "Viewport",
        icon: "mobile",
        items: [
          { value: "mobile", title: "Mobile (390px)", icon: "mobile" },
          { value: "tablet", title: "Tablet (768px)", icon: "tablet" },
          { value: "desktop", title: "Desktop (1280px)", icon: "desktop" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, { globals, viewMode, parameters }) => {
      const layout = parameters.layout as string | undefined;
      const isFullscreen = layout === "fullscreen";

      const storyShellClass = isFullscreen
        ? "min-h-[100svh] w-full"
        : "flex min-h-[100svh] w-full items-center justify-center p-6";

      /**
       * Docs embeds every story in a canvas. `min-h-[100svh]` there turns each
       * specimen into a full viewport of empty space. Center a compact column
       * instead; fullscreen page stories still own their height.
       */
      const docsShellClass = isFullscreen ? "w-full" : "mx-auto w-full max-w-3xl p-6";

      return (
        <MotionConfig reducedMotion="user">
          <div
            data-theme={globals.theme === "dark" ? "dark" : undefined}
            className={[
              "bg-body text-fg font-sans w-full",
              viewMode === "docs" ? docsShellClass : storyShellClass,
            ].join(" ")}
          >
            <Story />
          </div>
        </MotionConfig>
      );
    },
  ],
  parameters: {
    options: {
      /**
       * Introduction → Foundation (designed) → Atoms → Molecules → Organisms → Examples.
       * Nested `order` is a sibling array after the parent name — not `[parent, [children]]`.
       * Comparator is the source of truth so Foundation cannot fall back to A–Z.
       */
      storySort: (a, b) => {
        const tiers = ["Introduction", "Foundation", "Atoms", "Molecules", "Organisms", "Examples"];
        const foundation = [
          "Grid",
          "Colors",
          "Typography",
          "Spacing",
          "Shadows",
          "Motion",
          "Icons",
        ];
        const rank = (title, list) => {
          const index = list.indexOf(title);
          return index === -1 ? list.length : index;
        };
        const aTitle = a.title ?? "";
        const bTitle = b.title ?? "";
        const aTier = aTitle.split("/")[0] ?? "";
        const bTier = bTitle.split("/")[0] ?? "";
        const tierDelta = rank(aTier, tiers) - rank(bTier, tiers);
        if (tierDelta !== 0) return tierDelta;
        if (aTier === "Foundation") {
          const aName = aTitle.split("/")[1] ?? "";
          const bName = bTitle.split("/")[1] ?? "";
          const foundationDelta = rank(aName, foundation) - rank(bName, foundation);
          if (foundationDelta !== 0) return foundationDelta;
        }
        return aTitle.localeCompare(bTitle, undefined, { numeric: true });
      },
    },
    /** Mobile-first — default Storybook viewport is Mobile (390px). Use toolbar to check tablet/desktop. */
    /** Decorator owns centering — avoid Storybook's `centered` layout (shrinks canvas to content width). */
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    viewport: {
      options: storybookViewports,
    },
  },
  initialGlobals: {
    viewport: { value: "mobile", isRotated: false },
  },
};

export default preview;
