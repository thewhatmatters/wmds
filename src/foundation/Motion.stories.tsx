import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  focusRingTransitionClasses,
  motionFeedback,
  motionPanelRevealFromStart,
  motionPanelRevealTransition,
  motionSubNavItemVariants,
  motionSubNavListVariants,
  motionTransition,
  motionTransitionProp,
  pressScaleClass,
  resolveMotionTokenValues,
} from "../lib/motion";
import { FoundationSpecimen } from "./FoundationSpecimen";

const meta = {
  title: "Foundation/Motion",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Astryx-aligned duration and easing tokens in **`src/theme/motion.css`**. " +
          "Prefer **CSS `transition`** + `motionTransition()` for hovers and color; use **[Motion](https://motion.dev/docs/react)** for layout and enter/exit. " +
          "Reference: [Astryx Motion](https://astryx.atmeta.com/docs/motion). " +
          "**Fast** — high-frequency (hover, focus). **Medium** — spatial change (panels, collapse). **Slow** — rare hero transitions. " +
          "Storybook wraps `<MotionConfig reducedMotion=\"user\">`.",
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
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-border text-muted">
          <th className="py-2 pr-4 font-medium">Token</th>
          <th className="py-2 pr-4 font-medium">Value</th>
          <th className="py-2 font-medium">Role</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ token, value, role }) => (
          <tr key={token} className="border-b border-border-emphasized">
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
      <FoundationSpecimen className="flex flex-col gap-8">
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
      </FoundationSpecimen>
    );
  },
};

export const CssTransitions: Story = {
  name: "CSS transitions",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Hover each track — same distance, different Astryx tier. " +
          "High-frequency hovers belong on **fast**; layout shifts use **medium**.",
      },
    },
  },
  render: () => (
    <FoundationSpecimen className="flex flex-col gap-6">
      <p className="text-sm text-muted">
        Hover each row — the bar travels the same distance; only the duration tier changes.
      </p>
      {(
        [
          ["fast", "175ms", "--duration-fast"],
          ["medium", "410ms", "--duration-medium"],
          ["medium-max", "550ms", "--duration-medium-max"],
        ] as const
      ).map(([duration, label, token]) => (
        <div key={duration} className="group flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-fg">{label}</span>
            <span className="font-mono text-muted">{token}</span>
          </div>
          <div className="relative h-10 overflow-hidden rounded-lg border border-border bg-surface">
            <div
              className={`absolute inset-y-0 left-0 w-1/4 rounded-md bg-primary transition-[width] ease-standard group-hover:w-full ${motionTransition(duration)}`}
            />
          </div>
        </div>
      ))}
    </FoundationSpecimen>
  ),
};

export const PressScale: Story = {
  name: "Press scale (CSS)",
  render: () => (
    <FoundationSpecimen>
      <button
        type="button"
        className={`rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-[color,transform] hover:bg-primary-hover ${motionTransition("fast")} ${pressScaleClass}`}
      >
        Hover for color · hold click for scale
      </button>
    </FoundationSpecimen>
  ),
};

export const FocusRingFade: Story = {
  name: "Focus ring fade",
  parameters: {
    docs: {
      description: {
        story:
          "`focusRingTransitionClasses` — **fast** (175ms) box-shadow fade. Astryx: focus must not lag behind the user.",
      },
    },
  },
  render: () => (
    <FoundationSpecimen>
      <input
        type="text"
        aria-label="Focus ring specimen"
        placeholder="Tab to focus — ring fades in"
        className={`h-11 w-full max-w-xs rounded-lg border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body ${focusRingTransitionClasses}`}
      />
    </FoundationSpecimen>
  ),
};

export const MotionGestures: Story = {
  name: "Motion gestures",
  render: () => (
    <FoundationSpecimen>
      <motion.button
        type="button"
        className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-accent"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={motionTransitionProp("fast")}
      >
        whileHover / whileTap
      </motion.button>
    </FoundationSpecimen>
  ),
};

export const EnterExit: Story = {
  name: "Enter / exit (AnimatePresence)",
  render: function EnterExitDemo() {
    const [visible, setVisible] = useState(true);

    return (
      <FoundationSpecimen className="flex flex-col items-start gap-4">
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
              transition={motionTransitionProp("medium")}
            >
              Panel enter/exit — medium tier for spatial change.
            </motion.div>
          ) : null}
        </AnimatePresence>
      </FoundationSpecimen>
    );
  },
};

export const PanelReveal: Story = {
  name: "Panel reveal",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "`motionPanelRevealFromStart` / `motionPanelRevealFromTop` + `motionPanelRevealTransition()` — secondary column slide + fade. Medium tier; rows stagger on **fast**.",
      },
    },
  },
  render: function PanelRevealDemo() {
    const [visible, setVisible] = useState(true);

    return (
      <FoundationSpecimen className="flex flex-col items-start gap-4">
        <button
          type="button"
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-fg hover:bg-secondary"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "Hide panel" : "Show panel"}
        </button>
        <div className="flex h-48 w-full overflow-hidden rounded-lg border border-border bg-body">
          <div className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-border bg-surface py-3">
            <span className="size-8 rounded-lg bg-secondary" />
            <span className="size-8 rounded-lg bg-accent-muted" />
          </div>
          <AnimatePresence mode="wait">
            {visible ? (
              <motion.aside
                key="subnav"
                className="flex w-44 flex-col gap-1 border-r border-border bg-surface p-2"
                variants={motionPanelRevealFromStart}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={motionPanelRevealTransition()}
              >
                <motion.ul
                  className="m-0 flex list-none flex-col gap-0.5 p-0"
                  variants={motionSubNavListVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {["Overview", "Color", "Motion"].map((label) => (
                    <motion.li
                      key={label}
                      variants={motionSubNavItemVariants}
                      className="rounded-lg px-2 py-1.5 text-sm text-fg"
                    >
                      {label}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.aside>
            ) : null}
          </AnimatePresence>
          <div className="flex flex-1 items-start p-3 text-sm text-muted">Main</div>
        </div>
      </FoundationSpecimen>
    );
  },
};

export const LayoutAnimation: Story = {
  name: "Layout animation",
  render: function LayoutDemo() {
    const [expanded, setExpanded] = useState(false);

    return (
      <FoundationSpecimen>
        <motion.button
        type="button"
        layout
        className="overflow-hidden rounded-lg bg-primary px-4 py-2 text-left text-sm text-primary-foreground"
        onClick={() => setExpanded((e) => !e)}
        transition={motionTransitionProp("medium")}
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
              transition={motionTransitionProp("fast")}
              className="mt-2 text-primary-foreground/80"
            >
              Layout prop animates size and position when content changes.
            </motion.p>
          ) : null}
        </AnimatePresence>
        </motion.button>
      </FoundationSpecimen>
    );
  },
};

export const Principles: Story = {
  name: "When motion helps vs hurts",
  render: () => (
    <FoundationSpecimen className="flex flex-col gap-4 text-sm text-fg">
      <section>
        <h3 className="mb-2 font-medium">Animate (medium / slow)</h3>
        <ul className="list-disc space-y-1 pl-5 text-muted">
          <li>Panels, dialogs, collapsible sections opening</li>
          <li>Secondary panel reveal (`motionPanelRevealFromStart`)</li>
          <li>Find pill morphing into Search</li>
          <li>Validation band appearing under Input</li>
        </ul>
      </section>
      <section>
        <h3 className="mb-2 font-medium">Keep fast (fast tier)</h3>
        <ul className="list-disc space-y-1 pl-5 text-muted">
          <li>Button hover and press</li>
          <li>Chip filter toggle</li>
          <li>List row highlight</li>
          <li>Focus rings</li>
        </ul>
      </section>
      <section>
        <h3 className="mb-2 font-medium">Do not delay interaction</h3>
        <p className="text-muted">
          Motion completes before or without blocking the next action. Honor{" "}
          <code className="font-mono text-xs">prefers-reduced-motion</code>.
        </p>
      </section>
    </FoundationSpecimen>
  ),
};
