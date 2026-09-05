import type { Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { storybookViewports } from "../src/lib/viewports";
import "../src/styles/global.css";
import "./docs.css";
import "./docs-preview.css";

type WmdsLayout = "centered" | "padded" | "fullscreen";

function PreviewShell({
  children,
  globals,
  viewMode,
  parameters,
}: {
  children: ReactNode;
  globals: { theme?: string };
  viewMode: string;
  parameters: { wmdsLayout?: WmdsLayout };
}) {
  const wmdsLayout = parameters.wmdsLayout ?? "centered";
  const isFullscreen = wmdsLayout === "fullscreen";
  const isPadded = wmdsLayout === "padded";
  const isDark = globals.theme === "dark";

  /** Sync toolbar theme to :root so autodocs preview chrome picks up token swaps. */
  useEffect(() => {
    if (isDark) {
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  /** Canvas tab — Examples use `wmdsLayout: "fullscreen"`. */
  const storyShellClass = isFullscreen
    ? "min-h-[100svh] w-full"
    : isPadded
      ? "w-full p-6"
      : "flex min-h-[min(100svh,640px)] w-full items-center justify-center p-6";

  /** Autodocs — fill stretched preview block (see docs-preview.css). */
  const docsShellClass = isFullscreen
    ? "min-h-[100svh] w-full"
    : isPadded
      ? "min-h-full w-full p-6"
      : "flex min-h-full w-full items-center justify-center p-6";

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-theme={isDark ? "dark" : undefined}
        className={[
          "bg-body text-fg font-sans w-full",
          viewMode === "story" ? storyShellClass : docsShellClass,
        ].join(" ")}
      >
        {children}
      </div>
    </MotionConfig>
  );
}

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
    (Story, context) => (
      <PreviewShell
        globals={context.globals}
        viewMode={context.viewMode}
        parameters={context.parameters}
      >
        <Story />
      </PreviewShell>
    ),
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
          "Form controls",
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
    /**
     * Storybook `layout: fullscreen` keeps the iframe from shrink-wrapping content.
     * Specimen centering / padding is owned by `wmdsLayout` in PreviewShell.
     */
    layout: "fullscreen",
    wmdsLayout: "centered",
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
    /** Show code is opt-in — Pattern stories set `storyCopySource()` only. */
    docs: {
      source: {
        disable: true,
      },
    },
  },
  initialGlobals: {
    viewport: { value: "mobile", isRotated: false },
  },
};

export default preview;
