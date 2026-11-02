import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { Progress } from "./Progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

A progress bar for waits over 10 seconds, and for every upload and export (Loading states Y1, Y9). Under 1 second show nothing; 1–10 seconds, a **Skeleton** for a region or a spinner with words for one part (see \`useDelayedLoading\`).

## Anatomy

\`\`\`
Progress
├── label row — label | "3 of 12 files" or "25%"
├── bar — role="progressbar" (aria-valuenow / min / max, aria-valuetext)
└── footer — time left or the error message | Retry, Cancel
\`\`\`

## Best practices

- **Do** give a total whenever you know one: "3 of 12 files" (\`unit\`) or a percentage. Indeterminate (no \`value\`) only when there's no total.
- **Do** always give a way out (\`onCancel\`). \`cancellable={false}\` only for work that can't be stopped once begun.
- **Do** say what failed in \`message\` and offer \`onRetry\`.
- **Don't** use it under 10 seconds, or for steps in a flow (that's **StepProgress**).
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UploadPattern: Story = {
  name: "Pattern — upload with a count",
  args: { label: "Uploading photos", value: 3, max: 12, unit: "files", timeLeft: "About 2 minutes left", onCancel: fn() },
  render: (args) => (
    <div className="w-full max-w-md">
      <Progress {...args} />
    </div>
  ),
  play: async ({ canvas, args }) => {
    const bar = canvas.getByRole("progressbar", { name: "Uploading photos" });
    await expect(bar).toHaveAttribute("aria-valuenow", "3");
    await expect(bar).toHaveAttribute("aria-valuemax", "12");
    await expect(bar).toHaveAttribute("aria-valuetext", "3 of 12 files, About 2 minutes left");
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
  parameters: storyCopySource(`
import { Progress } from "@thewhatmatters/wmds";

export function PhotoUpload({ done, onCancel }: { done: number; onCancel: () => void }) {
  return <Progress label="Uploading photos" value={done} max={12} unit="files" timeLeft="About 2 minutes left" onCancel={onCancel} />;
}
`),
};

export const Percentage: Story = {
  name: "Pattern — export, percentage",
  args: { label: "Exporting video", value: 45, onCancel: fn(), cancelLabel: "Cancel export" },
  render: (args) => (
    <div className="w-full max-w-md">
      <Progress {...args} />
    </div>
  ),
};

export const Indeterminate: Story = {
  name: "State — no total",
  args: { label: "Preparing your files", onCancel: fn() },
  render: (args) => (
    <div className="w-full max-w-md">
      <Progress {...args} />
    </div>
  ),
};

export const Failed: Story = {
  name: "State — failed, with retry",
  args: {
    label: "Uploading photos",
    value: 7,
    max: 12,
    unit: "files",
    status: "error",
    message: "The connection dropped. 7 of 12 are uploaded.",
    onRetry: fn(),
    onCancel: fn(),
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <Progress {...args} />
    </div>
  ),
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("The connection dropped.");
    await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

export const Complete: Story = {
  name: "State — complete, announced",
  args: { label: "Upload", value: 12, max: 12, unit: "files", onCancel: fn() },
  render: (args) => (
    <div className="w-full max-w-md">
      <Progress {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Upload complete");
    await expect(canvas.queryByRole("button", { name: "Cancel" })).toBeNull();
  },
};
