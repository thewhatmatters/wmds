import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/Button/Button";
import { motionDurations, motionEasing, motionFeedback } from "./motion";
import { typographyClass } from "./typography";

function MotionReference() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12 font-sans">
      <header className="flex flex-col gap-2">
        <h1 className={typographyClass("page-heading")}>Motion</h1>
        <p className={`${typographyClass("body")} text-muted`}>
          Duration and easing tokens for interactive feedback. Motion values are theme-agnostic —
          same rhythm in light and dark. Sound is intentionally <strong>not</strong> in WMDS; apps
          opt in at the root if needed.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className={typographyClass("overline")}>Durations</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2 pr-4 font-medium">Token</th>
              <th className="py-2 pr-4 font-medium">Value</th>
              <th className="py-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {motionDurations.map((row) => (
              <tr key={row.token} className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs text-fg">{row.token}</td>
                <td className="py-2 pr-4 text-fg">{row.value}</td>
                <td className="py-2 text-muted">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={typographyClass("overline")}>Easing</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2 pr-4 font-medium">Token</th>
              <th className="py-2 pr-4 font-medium">Value</th>
              <th className="py-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {motionEasing.map((row) => (
              <tr key={row.token} className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs text-fg">{row.token}</td>
                <td className="py-2 pr-4 font-mono text-xs text-fg">{row.value}</td>
                <td className="py-2 text-muted">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={typographyClass("overline")}>Press feedback</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2 pr-4 font-medium">Token</th>
              <th className="py-2 pr-4 font-medium">Value</th>
              <th className="py-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {motionFeedback.map((row) => (
              <tr key={row.token} className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs text-fg">{row.token}</td>
                <td className="py-2 pr-4 text-fg">{row.value}</td>
                <td className="py-2 text-muted">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={`${typographyClass("body")} text-muted`}>
          Click and hold any button below — scale uses{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-xs">--motion-press-scale</code> over{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-xs">--duration-fast</code>.
          Disabled and loading skip transform.{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-xs">prefers-reduced-motion</code>{" "}
          disables transitions globally.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success" size="sm">
            Accepted
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundation/Motion",
  component: MotionReference,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Motion tokens for WMDS. Button ships with default press scale; drawers and crossfades " +
          "in product UIs (e.g. agent recommendation card) compose these tokens at the surface level.",
      },
    },
  },
} satisfies Meta<typeof MotionReference>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reference: Story = {
  render: () => <MotionReference />,
};
