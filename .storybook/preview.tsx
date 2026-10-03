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

  /** Canvas tab — Sites and Guides pages use `wmdsLayout: "fullscreen"`. */
  const storyShellClass = isFullscreen
    ? "flex h-[100svh] min-h-[100svh] w-full flex-col"
    : isPadded
      ? "w-full p-6"
      : "flex min-h-[min(100svh,640px)] w-full items-center justify-center p-6";

  /** Autodocs — fill stretched preview block (see docs-preview.css). */
  const docsShellClass = isFullscreen
    ? "flex h-[100svh] min-h-[100svh] w-full flex-col"
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
        icon: "desktop",
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
       * Sidebar order (ADR-0026, amended 2026-10-03): Getting started → Guides →
       * Foundations → Components → Sites → Internal. Components → Overview leads its
       * section; everything else is A–Z by path segment, with WhatMatters first under
       * Sites. Atomic tiers stay an implementation detail of src/components.
       * Self-contained on purpose — Storybook evaluates this function on its own.
       */
      storySort: (a, b) => {
        const sections = ["Getting started", "Guides", "Foundations", "Components", "Sites", "Internal"];
        const pinned = { Components: "Overview", Sites: "WhatMatters" };
        const aParts = (a.title ?? "").split("/");
        const bParts = (b.title ?? "").split("/");
        const rank = (section) => {
          const index = sections.indexOf(section);
          return index === -1 ? sections.length : index;
        };
        const sectionDelta = rank(aParts[0]) - rank(bParts[0]);
        if (sectionDelta !== 0) return sectionDelta;
        const first = pinned[aParts[0]];
        if (first && aParts[1] !== bParts[1]) {
          if (aParts[1] === first) return -1;
          if (bParts[1] === first) return 1;
        }
        const depth = Math.max(aParts.length, bParts.length);
        for (let i = 1; i < depth; i += 1) {
          const delta = (aParts[i] ?? "").localeCompare(bParts[i] ?? "", undefined, { numeric: true, sensitivity: "base" });
          if (delta !== 0) return delta;
        }
        return 0;
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
      test: "error",
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
    viewport: { value: "desktop", isRotated: false },
  },
};

export default preview;
