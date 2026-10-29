import { useEffect, useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { withStoryCopySource } from "../../../lib/storyCopySource";
import { TextArea, textareaResizes, inputStatuses } from "./TextArea";

function TextAreaSpecimen({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-sm px-8 py-6">{children}</div>;
}

const meta = {
  title: "Components/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TextAreaSpecimen>
        <Story />
      </TextAreaSpecimen>
    ),
  ],
  argTypes: {
    status: { control: "select", options: [undefined, ...inputStatuses] },
    resize: { control: "select", options: [...textareaResizes] },
    label: { control: "text" },
    description: { control: "text" },
    message: { control: "text" },
    liveStatus: { control: "text" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    rows: { control: "number" },
    size: { control: false },
  },
  args: {
    size: "md",
    rows: 4,
    resize: "vertical",
    disabled: false,
    loading: false,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

**Element-radius** multiline field (\`rounded-xl\` / 12px), not pill. Same optional label and **status validation** as **Input** (ADR-0006).

| Pattern | Props |
|---------|--------|
| **With label** | \`label\`, optional \`description\` (the hint, above the field, kept with a status message) |
| **Validation** | \`status\` + \`message\` — tinted status band (\`messagePosition\` top or bottom) |
| **Status only** | \`status\` without \`message\` — border + top-trailing icon |
| **Live status** | \`liveStatus\` — "Saving…" / "Saved" announced politely (\`role="status"\`, \`aria-live="polite"\`) |
| **Loading** | \`loading\` — trailing spinner |
| **Resize** | \`resize="none" | "vertical" | "both"\` — default \`vertical\` |
| **Inline** | \`inline\` — no shell. **PromptBar** owns the pill. Not a standalone field |

## Anatomy

- **Shell** — \`rounded-xl\`, border + \`shadow-raised\`, shared focus ring tokens from \`inputShellStyles\`
- **Trailing** — status icon / spinner top-right (multiline inset)
- **Status band** — same compound validation morph as **Input**, overlap tuned for taller field

## Best practices

- **Do** use \`status\` + \`message\` for validation — not label asterisks.
- **Do** set \`aria-label\` when \`label\` is omitted.
- **Do** use \`liveStatus\` for progress ("Saving…", "Saved"); pass \`""\` when idle so the region stays mounted and the next change is heard. \`description\` and \`message\` are tied to the field with \`aria-describedby\`.
- **Do** keep \`resize="vertical"\` unless layout must stay fixed height.
- **Don't** restyle the shell with \`className\` — layout width only.
- **Don't** use \`inline\` outside **PromptBar**. The parent pill owns the border and focus ring.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bare: Story = {
  name: "Pattern — bare",
  args: {
    "aria-label": "Issue description",
  },
};

export const WithLabel: Story = {
  name: "Pattern — with label",
  args: {
    label: "Notes",
    description: "Visible to admins on this market record.",
  },
};

export const ErrorMessage: Story = {
  name: "Pattern — error message",
  args: {
    label: "Bio",
    defaultValue: "Sarah is a designer based in",
    status: "error",
    message: "Bio must be at least 40 characters.",
  },
};

export const WarningMessage: Story = {
  name: "Pattern — warning message",
  args: {
    label: "Public description",
    defaultValue: "Farmers market every Sunday…",
    status: "warning",
    message: "Description is close to the 280-character limit.",
  },
};

export const SuccessMessage: Story = {
  name: "Pattern — success message",
  args: {
    label: "Instructions",
    defaultValue: "Park on Philomena St. and enter through the south gate.",
    status: "success",
    message: "Instructions saved.",
  },
};

export const StatusWithoutMessage: Story = {
  name: "Pattern — status without message",
  args: {
    label: "Feedback",
    defaultValue: "Too short",
    status: "error",
  },
};

export const Loading: Story = {
  name: "Pattern — loading",
  args: {
    label: "Review",
    defaultValue: "Checking spelling…",
    loading: true,
  },
};

export const Disabled: Story = {
  name: "Pattern — disabled",
  args: {
    label: "Archived notes",
    defaultValue: "Read-only record from 2024.",
    disabled: true,
    resize: "none",
  },
};

export const Sizes: Story = {
  name: "Reference — sizes",
  parameters: {
    docs: {
      description: {
        story: "`sm` | `md` | `lg` — same scale as **Input** / **Select** (`inputShellStyles`).",
      },
    },
  },
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <TextArea size="sm" label="Small" rows={3} />
      <TextArea size="md" label="Medium" rows={4} />
      <TextArea size="lg" label="Large" rows={4} />
    </div>
  ),
};

export const ResizeNone: Story = {
  name: "Pattern — fixed height",
  args: {
    label: "Fixed height",
    resize: "none",
    rows: 5,
  },
};

export const SaveStatus: Story = {
  name: "Pattern — save status",
  args: {
    label: "Notes",
    description: "Saved automatically as you type.",
  },
  render: function SaveStatusRender(args) {
    const [value, setValue] = useState("");
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

    useEffect(() => {
      if (saveState !== "saving") return;
      const timer = setTimeout(() => setSaveState("saved"), 600);
      return () => clearTimeout(timer);
    }, [saveState, value]);

    return (
      <TextArea
        {...args}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setSaveState("saving");
        }}
        liveStatus={saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : ""}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Notes" });
    await expect(field).toHaveAccessibleDescription("Saved automatically as you type.");
    const region = canvas.getByRole("status");
    await expect(region).toHaveAttribute("aria-live", "polite");
    await userEvent.type(field, "Pick up tomatoes");
    await expect(region).toHaveTextContent("Saving…");
    await expect(await canvas.findByText("Saved")).toBeVisible();
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "`liveStatus` is a polite live region under the field. It stays mounted while idle (`\"\"`), so “Saving…” and “Saved” are announced. `description` is read with the field through `aria-describedby`.",
        },
      },
    },
    `
"use client";

import { useEffect, useState } from "react";
import { TextArea } from "@thewhatmatters/wmds";

export function NotesField() {
  const [value, setValue] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (saveState !== "saving") return;
    const timer = setTimeout(() => setSaveState("saved"), 600);
    return () => clearTimeout(timer);
  }, [saveState, value]);

  return (
    <TextArea
      label="Notes"
      description="Saved automatically as you type."
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        setSaveState("saving");
      }}
      liveStatus={saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : ""}
    />
  );
}
`,
  ),
};

export const Focused: Story = {
  name: "Focused",
  args: {
    label: "Intro",
    defaultValue: "This is my intro",
    description: "One ring on the shell. The field adds no outline or ring of its own.",
  },
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector("textarea");
    if (!field) throw new Error("TextArea field not found");
    field.focus();
    await waitFor(() => expect(field).toHaveFocus());
    expect(getComputedStyle(field).outlineStyle).toBe("none");
  },
};
