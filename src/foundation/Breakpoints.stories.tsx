import type { Meta, StoryObj } from "@storybook/react-vite";
import { breakpoints, minTouchTargetPx, storybookViewports } from "../lib/viewports";

const meta = {
  title: "Foundation/Breakpoints",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "**Mobile-first** — unprefixed Tailwind utilities target mobile; add **`sm:`**, **`md:`**, **`lg:`** to scale up. " +
          "Review every component at **Mobile (390px)**, **Tablet (768px)**, and **Desktop (1280px)** via the Storybook viewport toolbar. " +
          "Full decision: **`docs/adr/0003-responsive-mobile-first.md`**.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  name: "Breakpoint scale",
  render: () => (
    <table className="w-full max-w-2xl border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-left text-muted">
          <th className="py-2 pr-4 font-medium">Prefix</th>
          <th className="py-2 pr-4 font-medium">Min width</th>
          <th className="py-2 font-medium">Tier</th>
        </tr>
      </thead>
      <tbody>
        {breakpoints.map(({ prefix, minWidth, label }) => (
          <tr key={prefix} className="border-b border-border-emphasized">
            <td className="py-2 pr-4 font-mono text-xs">{prefix}</td>
            <td className="py-2 pr-4 font-mono text-xs text-muted">{minWidth}</td>
            <td className="py-2 text-fg">{label}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const StorybookViewports: Story = {
  name: "Storybook viewports",
  render: () => (
    <ul className="max-w-xl list-none space-y-2 p-0 text-sm text-fg">
      {Object.entries(storybookViewports).map(([key, { name, styles }]) => (
        <li key={key} className="font-mono text-xs">
          {name} — {styles.width} × {styles.height}
        </li>
      ))}
    </ul>
  ),
};

export const MobileFirstDemo: Story = {
  name: "Mobile-first layout",
  parameters: {
    docs: {
      description: {
        story:
          "Resize the Storybook viewport — column stack on mobile, row from **`md:`** up. This is the default WMDS layout pattern.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-4 md:flex-row md:items-center md:gap-6">
      <div className="flex-1 rounded-lg border border-border bg-surface p-4 text-sm text-fg">
        Primary block — full width on mobile
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
        <div
          className="flex min-h-11 min-w-11 items-center justify-center rounded-md bg-primary px-4 text-sm text-primary-foreground"
          title={`Min touch ${minTouchTargetPx}px`}
        >
          Action
        </div>
        <div className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm text-fg">
          Secondary
        </div>
      </div>
    </div>
  ),
};

export const TouchTarget: Story = {
  name: "Touch target minimum",
  render: () => (
    <div className="flex flex-col gap-3 text-sm text-fg">
      <p className="text-muted">
        Atoms on mobile: minimum {minTouchTargetPx}×{minTouchTargetPx}px hit area (
        <code className="font-mono text-xs">min-h-11 min-w-11</code> or padding equivalent).
      </p>
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-primary px-4 text-sm text-primary-foreground"
      >
        44px min
      </button>
    </div>
  ),
};
