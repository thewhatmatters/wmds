import type { Preview } from "@storybook/react-vite";
import { MotionConfig } from "motion/react";
import { storybookViewports } from "../src/lib/viewports";
import "../src/styles/global.css";

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
      const isPadded = layout === "padded";

      const storyShellClass = isFullscreen
        ? "min-h-[100svh] w-full"
        : isPadded
          ? "min-h-[100svh] w-full p-6"
          : "flex min-h-[100svh] w-full items-center justify-center p-6";

      return (
        <MotionConfig reducedMotion="user">
          <div
            data-theme={globals.theme === "dark" ? "dark" : undefined}
            className={[
              "bg-body text-fg font-sans w-full",
              viewMode === "story" ? storyShellClass : isFullscreen ? "min-h-[100svh] w-full" : "p-4",
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
      /** Introduction → Foundation → Atoms → Molecules → Organisms → Examples. */
      storySort: {
        method: "alphabetical-by-kind",
        order: [
          "Introduction",
          "Foundation",
          "Atoms",
          "Molecules",
          "Organisms",
          "Examples",
        ],
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
