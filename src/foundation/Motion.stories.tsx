import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  motionFeedback,
  motionTransition,
  motionTransitionProp,
  pressScaleClass,
  resolveMotionTokenValues,
} from "../lib/motion";

const meta = {
  title: "Foundation/Motion",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Duration and easing tokens in **`theme.css`**. Prefer **CSS `transition`** for simple effects; use **[Motion](https://motion.dev/docs/react)** for gestures, layout, and enter/exit. " +
          "Helpers in **`src/lib/motion.ts`**: `motionTransition()` (Tailwind classes), `motionTransitionProp()` (Motion `transition` — reads Theme CSS vars). " +
          "Respect **`prefers-reduced-motion`** — Storybook uses `<MotionConfig reducedMotion=\"user\">`.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function TokenTable({
  rows,
}: {
  rows: Array<{ token: string; value: string; role: string }>;
}) {
  return (
    <table className="w-full max-w-3xl border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-border text-muted">
          <th className="py-2 pr-4 font-medium">Token</th>
          <th className="py-2 pr-4 font-medium">Value</th>
          <th className="py-2 font-medium">Role</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ token, value, role }) => (
          <tr key={token} className="border-b border-border/60">
            <td className="py-2 pr-4 font-mono text-xs">{token}</td>
            <td className="py-2 pr-4 font-mono text-xs text-muted">{value}</td>
            <td className="py-2 text-fg">{role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const Tokens: Story = {
  render: () => {
    const { durations, easing } = resolveMotionTokenValues();
    return (
      <div className="flex max-w-3xl flex-col gap-8">
        <section>
          <h3 className="mb-3 text-sm font-medium text-fg">Durations</h3>
          <TokenTable rows={durations} />
        </section>
        <section>
          <h3 className="mb-3 text-sm font-medium text-fg">Easing</h3>
          <TokenTable rows={easing} />
        </section>
        <section>
          <h3 className="mb-3 text-sm font-medium text-fg">Press feedback</h3>
          <TokenTable rows={motionFeedback} />
        </section>
      </div>
    );
  },
};

const durationVar: Record<"fast" | "base" | "slower", string> = {
  fast: "var(--duration-fast)",
  base: "var(--duration-base)",
  slower: "var(--duration-slower)",
};

export const CssTransitions: Story = {
  name: "CSS transitions",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Hover each track — same distance, different **`--duration-*`** token. " +
          "**`prefers-reduced-motion`** disables the animation globally in Storybook.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <p className="text-sm text-muted">
        Hover each row — the bar travels the same distance; only the duration changes.
      </p>
      {(
        [
          ["fast", "150ms", "--duration-fast"],
          ["base", "200ms", "--duration-base"],
          ["slower", "300ms", "--duration-slower"],
        ] as const
      ).map(([duration, label, token]) => (
        <div key={duration} className="group flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-fg">{label}</span>
            <span className="font-mono text-muted">{token}</span>
          </div>
          <div className="relative h-10 overflow-hidden rounded-lg border border-border bg-surface">
            <div
              className="absolute inset-y-0 left-0 w-1/4 rounded-md bg-primary transition-[width] ease-[var(--ease-out-expo)] group-hover:w-full"
              style={{ transitionDuration: durationVar[duration] }}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const PressScale: Story = {
  name: "Press scale (CSS)",
  render: () => (
    <button
      type="button"
      className={`rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-[color,transform] hover:bg-primary-hover ${motionTransition("fast")} ${pressScaleClass}`}
    >
      Hover for color · hold click for scale
    </button>
  ),
};

export const MotionGestures: Story = {
  name: "Motion gestures",
  render: () => (
    <motion.button
      type="button"
      className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-accent"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={motionTransitionProp("fast")}
    >
      whileHover / whileTap
    </motion.button>
  ),
};

export const EnterExit: Story = {
  name: "Enter / exit (AnimatePresence)",
  render: function EnterExitDemo() {
    const [visible, setVisible] = useState(true);

    return (
      <div className="flex flex-col items-start gap-4">
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-fg hover:bg-secondary"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "Hide" : "Show"}
        </button>
        <AnimatePresence mode="wait">
          {visible ? (
            <motion.div
              key="panel"
              className="w-64 rounded-lg border border-border bg-surface p-4 text-sm text-fg shadow-raised"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={motionTransitionProp("base", "out-expo")}
            >
              Drawer-style enter/exit using WMDS tokens.
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
};

export const LayoutAnimation: Story = {
  name: "Layout animation",
  render: function LayoutDemo() {
    const [expanded, setExpanded] = useState(false);

    return (
      <motion.button
        type="button"
        layout
        className="overflow-hidden rounded-lg bg-primary px-4 py-2 text-left text-sm text-primary-foreground"
        onClick={() => setExpanded((e) => !e)}
        transition={motionTransitionProp("slower", "out-expo")}
      >
        <motion.span layout="position" className="block font-medium">
          {expanded ? "Collapse" : "Expand"}
        </motion.span>
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.p
              key="body"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={motionTransitionProp("base")}
              className="mt-2 text-primary-foreground/80"
            >
              Layout prop animates size and position when content changes.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </motion.button>
    );
  },
};
