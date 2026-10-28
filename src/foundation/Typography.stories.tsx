import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  astryxTypeScale,
  fontFamilies,
  fontWeights,
  resolveTypographyTokenValues,
  trackingRules,
  typographyClass,
  typographyStyles,
} from "../lib/typography";

const meta = {
  title: "Foundations/Typography",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "WMDS typography in **`src/theme/typography.css`**: geometric **`--font-size-*`** ramp (14px × 1.2) + semantic **`type-*`** utilities. " +
          "Components use **`typographyClass(role)`** from **`src/lib/typography.ts`** — not raw **`text-sm`** / **`font-medium`**. " +
          "See **ADR-0009**.\n\n" +
          "**Heading steps (Headings rule H7): skip a step between levels.** Adjacent heading levels on a page should be at least about 1.25× apart, and the ramp is 1.2×, so a heading and the one under it sit **two steps apart** (1.44×): e.g. `type-heading-1` (24px) over `type-heading-3` (17px), not `type-heading-2` (20px). Use at most three heading sizes per page. The ramp itself is unchanged; re-scaling it is logged as an open decision.\n\n" +
          "**Display type (Rule 3):** display-1/2/3 lead 1.05 / 1.1 / 1.15 and track −0.03 / −0.02 / −0.01em (hero −0.03em). **Shorten, don't shrink (D7):** if a display line runs past its line limit (HeroIntro, HeroTileStack, TextSequence headlines included), cut the copy; never drop to a smaller step to make it fit. A page has at most two display moments, the hero and one closing moment, never on the same screen (D9). A fitted logo-like wordmark (FooterReveal, SVG wordmarks) is a graphic: exempt from D1/D2, hidden from screen readers or labelled, still within contrast and the screen width.\n\n" +
          "**An eyebrow and its heading are one unit (Headings H4, Eyebrow E5).** The eyebrow sits 8–12px above its heading; the space above the unit (from the previous block) is larger than the space below the heading.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const GeometricScale: Story = {
  name: "Geometric scale",
  render: () => {
    const steps = resolveTypographyTokenValues();
    return (
      <div className="flex max-w-2xl flex-col gap-3 font-sans">
        <p className="type-supporting text-muted">
          Raw size ramp — adjust <code className="font-mono text-xs">--type-scale-base</code> and{" "}
          <code className="font-mono text-xs">--type-scale-ratio</code> holistically — adjust base and ratio together.
        </p>
        {steps.map(({ token, value, sample }) => (
          <div key={token} className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
            <span className="font-mono text-xs text-muted">{token}</span>
            <span className="font-mono text-xs text-fg">{value}</span>
            <span className="type-supporting text-muted">{sample}</span>
          </div>
        ))}
      </div>
    );
  },
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {fontWeights.map(({ token, value, role }) => (
        <p key={token} className="type-body text-fg" style={{ fontWeight: value }}>
          {token} ({value}) — {role}
        </p>
      ))}
    </div>
  ),
};

export const SemanticTypeScale: Story = {
  name: "Semantic type scale",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6 font-sans">
      <p className="type-supporting text-muted">
        Semantic triplets — size + weight + line-height composed in <code className="font-mono text-xs">type-*</code> utilities.
      </p>
      {astryxTypeScale.map(({ type, utility, size, weight, leading }) => (
        <div key={type} className="flex flex-col gap-1 border-b border-border-emphasized pb-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs text-muted">{type}</span>
            <span className="font-mono text-xs text-muted">{utility}</span>
            <span className="font-mono text-xs text-muted">
              {size} · {weight} · {leading}
            </span>
          </div>
          <p className={`${utility} text-fg`}>The quick brown fox jumps over the lazy dog</p>
        </div>
      ))}
    </div>
  ),
};

export const Roles: Story = {
  name: "WMDS roles",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8 font-sans">
      <p className="type-supporting text-muted">
        WMDS document roles map to semantic type utilities — import via{" "}
        <code className="font-mono text-xs text-fg">typographyClass(&quot;body&quot;)</code>.
      </p>
      {typographyStyles.map(({ role, label, description, astryxType, className, trackingClass, sample }) => (
        <div key={role} className="flex flex-col gap-1.5 border-b border-border pb-6 last:border-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs text-muted">{role}</span>
            <span className="type-label text-fg">{label}</span>
            <span className="font-mono text-xs text-muted">→ {astryxType} utility</span>
            <span className="font-mono text-xs text-muted">{trackingClass}</span>
          </div>
          <p className="type-supporting text-muted">{description}</p>
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
      <p className="type-supporting text-muted">
        Three tracking values — assigned only through typography roles.
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
            <tr key={tracking} className="border-b border-border-emphasized align-top">
              <td className="py-2 pr-4 font-mono text-xs">{tracking}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">{utility}</td>
              <td className="py-2 type-body text-fg">{rule}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col gap-4">
        <p className={typographyClass("page-heading")}>Page heading — tracking-tight</p>
        <p className={typographyClass("body")}>Body — tracking-normal</p>
        <p className={typographyClass("overline")}>Overline — 0.08em tracking</p>
        <p className={typographyClass("eyebrow")}>Eyebrow — type-eyebrow, mono</p>
        <p className="type-code text-muted">type-code — Geist Mono (0123456789)</p>
      </div>
    </div>
  ),
};

export const FontFamilies: Story = {
  name: "Font families",
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      {fontFamilies.map(({ name, tailwind, css, usage }) => (
        <div key={name} className="flex flex-col gap-1 border-b border-border pb-4 last:border-0">
          <span className="type-label text-fg">{name}</span>
          <span className="font-mono text-xs text-muted">
            {tailwind} · {css}
          </span>
          <span className="type-supporting text-muted">{usage}</span>
        </div>
      ))}
    </div>
  ),
};

/** @deprecated Use GeometricScale — kept as alias for bookmarks. */
export const Scale = GeometricScale;
