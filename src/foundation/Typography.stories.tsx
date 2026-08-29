import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  fontFamilies,
  trackingRules,
  typographyClass,
  typographyStyles,
} from "../lib/typography";

const scale: Array<{ step: string; className: string }> = [
  { step: "xs", className: "text-xs" },
  { step: "sm", className: "text-sm" },
  { step: "base", className: "text-base" },
  { step: "lg", className: "text-lg" },
  { step: "xl", className: "text-xl" },
  { step: "2xl", className: "text-2xl" },
  { step: "3xl", className: "text-3xl" },
];

const meta = {
  title: "Foundation/Typography",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Tailwind v4 type scale via **`@theme`**. Body UI defaults to **`text-sm`**; headings use **`text-lg`** and up. " +
          "Font families: **Geist Sans** (`font-sans`), **Geist Mono** (`font-mono`) — **`src/theme/fonts.css`**. " +
          "Letter spacing is assigned through **semantic roles** in **`src/lib/typography.ts`** — use **`typographyClass()`**, not raw **`tracking-*`** in components.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4 font-sans">
      {scale.map(({ step, className }) => (
        <p key={step} className={`${className} text-fg`}>
          text-{step} — The quick brown fox
        </p>
      ))}
      <p className="font-mono text-sm text-muted">font-mono — 0123456789 ABCD</p>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-sm text-fg">
      <p className="font-normal">font-normal (400)</p>
      <p className="font-medium">font-medium (500)</p>
      <p className="font-semibold">font-semibold (600)</p>
      <p className="font-bold">font-bold (700)</p>
    </div>
  ),
};

export const Roles: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8 font-sans">
      <p className="text-sm text-muted">
        Import roles via{" "}
        <code className="font-mono text-xs text-fg">typographyClass(&quot;body&quot;)</code> — tracking
        is included. Do not add <code className="font-mono text-xs text-fg">tracking-*</code> in
        components.
      </p>
      {typographyStyles.map(({ role, label, description, className, trackingClass, sample }) => (
        <div key={role} className="flex flex-col gap-1.5 border-b border-border pb-6 last:border-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs text-muted">{role}</span>
            <span className="text-sm font-medium text-fg">{label}</span>
            <span className="font-mono text-xs text-muted">{trackingClass}</span>
          </div>
          <p className="text-xs text-muted">{description}</p>
          <p className={className}>{sample}</p>
          <p className="font-mono text-[11px] text-muted">
            typographyClass(&quot;{role}&quot;)
          </p>
        </div>
      ))}
    </div>
  ),
};

export const LetterSpacing: Story = {
  name: "Letter spacing",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6 font-sans">
      <p className="text-sm text-muted">
        Three tracking values for the whole system — assigned only through typography roles.
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            <th className="py-2 pr-4 font-medium">Rule</th>
            <th className="py-2 pr-4 font-medium">Utility</th>
            <th className="py-2 font-medium">When</th>
          </tr>
        </thead>
        <tbody>
          {trackingRules.map(({ tracking, utility, rule }) => (
            <tr key={tracking} className="border-b border-border/60 align-top">
              <td className="py-2 pr-4 font-mono text-xs">{tracking}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">{utility}</td>
              <td className="py-2 text-fg">{rule}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col gap-4">
        <p className="text-2xl font-semibold tracking-tight text-fg">
          tracking-tight — Page heading sample
        </p>
        <p className="text-sm tracking-normal text-fg">
          tracking-normal — Body and UI label sample text at text-sm
        </p>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          tracking-wider — Overline sample
        </p>
        <p className="font-mono text-sm text-muted">
          font-mono — no tracking override (0123456789)
        </p>
      </div>
      <p className={typographyClass("overline")}>typographyClass(&quot;overline&quot;)</p>
    </div>
  ),
};

export const FontFamilies: Story = {
  name: "Font families",
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      {fontFamilies.map(({ name, tailwind, css, usage }) => (
        <div key={name} className="flex flex-col gap-1 border-b border-border pb-4 last:border-0">
          <span className="text-sm font-medium text-fg">{name}</span>
          <span className="font-mono text-xs text-muted">
            {tailwind} · {css}
          </span>
          <span className="text-xs text-muted">{usage}</span>
        </div>
      ))}
    </div>
  ),
};
