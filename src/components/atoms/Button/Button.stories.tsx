import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Copy, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Button,
  buttonLayouts,
  buttonRoles,
  buttonStatusHoldMs,
  getNextButtonStatus,
  type ButtonStatus,
} from "./Button";
import { typographyClass } from "../../../lib/typography";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";

const meta = {
  title: "Components/Button/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    role: { control: "select", options: [...buttonRoles] },
    layout: { control: "select", options: [...buttonLayouts] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    status: { control: "select", options: ["idle", "loading", "success", "error"] },
    count: { control: "number" },
    disableOnError: { control: "boolean" },
    disabled: { control: "boolean" },
    icon: { control: false },
    onClick: { action: "clicked" },
  },
  args: {
    children: "Label",
    role: "primary",
    size: "md",
    disabled: false,
  },
  parameters: {
    docs: {
      ...storyMetaDocsDefaults().docs,
      description: {
        component: `
## Usage

**Prescribed patterns** — pick one story, copy the code. Not a composable slot API.

| Pattern | Props |
|---------|--------|
| **Action** | \`role\` + label |
| **Row** | \`layout="row"\` + \`role="ghost"\` — flat full-width detail / settings lines |
| **Nav** | \`layout="nav"\` + \`selected\` — inset pill rows; compose in **NavList** only |
| **With icon** | \`icon\` (Lucide) + \`role\` |
| **Outline mono** | \`role="outline"\` + \`mono\` + \`endIcon\` — hairline pill, mono uppercase label, accent arrow square |
| **With count** | \`count\` + \`role\` (inbox / notifications) |
| **Submit / async** | \`status\` + optional \`statusLabels\` |
| **Copy** | \`icon\` + \`status\` — the icon morphs into the check; hold with \`buttonStatusHoldMs\` |
| **Link** | \`render={<a href />}\` — Button chrome on a real anchor (nav links, header CTAs) |
| **External link** | \`render={<a href />}\` + \`external\` — new tab, safe \`rel\`, spoken "opens in a new tab", trailing icon |

Pill-shaped by default (\`layout="pill"\`). **Row layout** is flat full-width — for TaskRows detail lines and settings rows. **Roles:** \`primary\` (main CTA), \`secondary\`, \`ghost\`, \`destructive\`, \`inverse\` (surface fill and brand text, for a brand-blue field), \`outline\` (hairline border, transparent fill). \`mono\` sets a mono uppercase label. \`endIcon\` adds a trailing accent square. No semantic color variants — success/error live on \`status\` morph only.

## Best practices

- **Do** copy a named story below — don't mix \`status\` with \`count\`, \`endIcon\`, or \`mono\`.
- **Do** use \`status\` for form submit and async feedback; with \`icon\`, the status glyph morphs out of the icon. \`status\` sits on the pill's live region, so its labels are announced.
- **Do** set \`external\` on a link to another site — never hand-write \`target\`, \`rel\`, or "(opens in a new tab)".
- **Do** use \`count\` only for numeric notification badges on nav actions.
- **Don't** pass arbitrary nodes — no slots, no \`className\` for colors.
- **Don't** invent new button looks in app code — extend WMDS via ADR.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiStateBadge: Story = {
  name: "Pattern — submit / async",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Primary pattern for form submit and async actions. Control `status` from parent state after API response.",
        },
      },
      wmdsLayout: "centered",
      backgrounds: { default: "dark" },
    },
    `
import { useState } from "react";
import { Button, getNextButtonStatus, type ButtonStatus } from "@thewhatmatters/wmds";

export function SubmitForm() {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  return (
    <Button status={status} onClick={() => setStatus(getNextButtonStatus(status))}>
      Submit
    </Button>
  );
}
    `,
  ),
  render: function SubmitPattern() {
    const [status, setStatus] = useState<ButtonStatus>("idle");

    return (
      <Button
        status={status}
        onClick={() => setStatus(getNextButtonStatus(status))}
      >
        Submit
      </Button>
    );
  },
};

export const PrimaryAction: Story = {
  name: "Pattern — primary action",
  parameters: storyCopySource(`
import { Button } from "@thewhatmatters/wmds";

<Button role="primary">Save changes</Button>
  `),
  args: { role: "primary", children: "Save changes" },
};

export const SecondaryAction: Story = {
  name: "Pattern — secondary action",
  parameters: storyCopySource(`
import { Button } from "@thewhatmatters/wmds";

<Button role="secondary">Cancel</Button>
  `),
  args: { role: "secondary", children: "Cancel" },
};

export const OutlineMono: Story = {
  name: "Pattern — outline mono",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Hairline outline, transparent fill, mono uppercase label, and a trailing accent square. size sm. endIcon is a Lucide glyph. The gallery intro action is Button role secondary, not this pattern.",
        },
      },
    },
    `
import { ArrowRight } from "lucide-react";
import { Button } from "@thewhatmatters/wmds";

<Button role="outline" size="sm" mono endIcon={<ArrowRight />}>
  See our work
</Button>
    `,
  ),
  args: {
    role: "outline",
    size: "sm",
    mono: true,
    children: "See our work",
  },
  render: (args) => (
    <Button {...args} endIcon={<ArrowRight />}>
      See our work
    </Button>
  ),
};

export const InverseAction: Story = {
  name: "Pattern — inverse action",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "White pill with brand text. Use it on a brand-navy field (**FooterReveal**). Brand text (`#011272`) on white (`#ffffff`) reports **15.8:1**. **FooterReveal** passes `type=\"button\"` and `onCtaClick`. Compose `render={<a href />}` when this control navigates.",
        },
      },
    },
    `
import { Button } from "@thewhatmatters/wmds";

<Button role="inverse" size="lg">Start a project</Button>
    `,
  ),
  args: { role: "inverse", size: "lg", children: "Start a project" },
};

export const GhostAction: Story = {
  name: "Pattern — ghost action",
  parameters: storyCopySource(`
import { Button } from "@thewhatmatters/wmds";

<Button role="ghost">Learn more</Button>
  `),
  args: { role: "ghost", children: "Learn more" },
};

export const LinkRender: Story = {
  name: "Pattern — link",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Navigation that looks like an action: compose Button chrome onto a real anchor with `render`. Pill layout only; `disabled` becomes `aria-disabled`. Used by **SiteNav** links and header CTAs. Prose links stay **TextLink**.",
        },
      },
    },
    `
import { Button } from "@thewhatmatters/wmds";

export function HeaderLinks() {
  return (
    <>
      <Button role="ghost" size="sm" render={<a href="/docs" />}>Docs</Button>
      <Button size="sm" render={<a href="/signup" />}>Get started</Button>
    </>
  );
}
    `,
  ),
  render: () => (
    <div className="flex items-center gap-2">
      <Button role="ghost" size="sm" render={<a href="#docs" />}>
        Docs
      </Button>
      <Button role="ghost" size="sm" render={<a href="#platform" />} aria-current="page">
        Platform
      </Button>
      <Button size="sm" render={<a href="#signup" />}>
        Get started
      </Button>
      <Button role="secondary" size="sm" disabled render={<a href="#soon" />}>
        Coming soon
      </Button>
    </div>
  ),
};

export const CopyButton: Story = {
  name: "Pattern — copy button",
  render: function CopyButtonRender() {
    const [status, setStatus] = useState<ButtonStatus>("idle");

    useEffect(() => {
      if (status !== "success" && status !== "error") return;
      const timer = window.setTimeout(() => setStatus("idle"), buttonStatusHoldMs);
      return () => window.clearTimeout(timer);
    }, [status]);

    async function copy() {
      try {
        await navigator.clipboard.writeText("# How we scope a brand sprint");
        setStatus("success");
      } catch {
        setStatus("error");
      }
    }

    return (
      <Button
        role="secondary"
        size="sm"
        icon={<Copy />}
        status={status}
        statusLabels={{ success: "Copied", error: "Couldn't copy" }}
        onClick={copy}
      >
        Copy for LLM
      </Button>
    );
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Copies text and confirms it. The Copy glyph morphs into the check and the label into \"Copied\"; a refused clipboard shows \"Couldn't copy\". Either holds for `buttonStatusHoldMs` (2s), then the button returns. The labels sit in the button's live region, so screen readers hear the result.",
        },
      },
    },
    `
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Button, buttonStatusHoldMs, type ButtonStatus } from "@thewhatmatters/wmds";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = window.setTimeout(() => setStatus("idle"), buttonStatusHoldMs);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Button
      role="secondary"
      size="sm"
      icon={<Copy />}
      status={status}
      statusLabels={{ success: "Copied", error: "Couldn't copy" }}
      onClick={copy}
    >
      {label}
    </Button>
  );
}
`,
  ),
};

export const ExternalLink: Story = {
  name: "Pattern — external link",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button role="secondary" size="sm" external render={<a href="https://x.com/intent/post?url=https%3A%2F%2Fwhatmatters.so" />}>
        Twitter/X
      </Button>
      <Button
        role="secondary"
        size="sm"
        external
        render={<a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwhatmatters.so" />}
      >
        LinkedIn
      </Button>
    </div>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A pill link to another site. `external` opens it in a new tab with a safe `rel`, adds the spoken \"(opens in a new tab)\", and shows the trailing icon **TextLink** uses (`externalIcon={false}` drops the icon).",
        },
      },
    },
    `
import { Button } from "@thewhatmatters/wmds";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        role="secondary"
        size="sm"
        external
        render={<a href={"https://x.com/intent/post?url=" + encodedUrl + "&text=" + encodedTitle} />}
      >
        Twitter/X
      </Button>
      <Button
        role="secondary"
        size="sm"
        external
        render={<a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl} />}
      >
        LinkedIn
      </Button>
    </div>
  );
}
`,
  ),
};

export const RowLayout: Story = {
  name: "Pattern — row",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Flat full-width ghost row for detail lines (TaskRows.Detail) and settings lists. Mutually exclusive with `icon`, `count`, and `status`.",
        },
      },
    },
    `
import { Button } from "@thewhatmatters/wmds";

export function DueDateRow({ onOpenDatePicker }: { onOpenDatePicker: () => void }) {
  return (
    <Button role="ghost" layout="row" type="button" onClick={onOpenDatePicker}>
      <span>Due date</span>
      <span>Sep 12</span>
    </Button>
  );
}
    `,
  ),
  render: () => (
    <div className="max-w-md rounded-lg border border-border bg-surface p-3">
      <Button role="ghost" layout="row" type="button" onClick={() => undefined}>
        <span className={typographyClass("caption") + " text-muted"}>Due date</span>
        <span className={typographyClass("caption")}>Sep 12</span>
      </Button>
      <Button role="ghost" layout="row" type="button" onClick={() => undefined}>
        <span className={typographyClass("caption") + " text-muted"}>Assignee</span>
        <span className={typographyClass("caption")}>Alex</span>
      </Button>
    </div>
  ),
};

export const RowHug: Story = {
  name: "Pattern — row (hug)",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "\`width=\"hug\"\` sizes a ghost row to its content with a tight gap — an inline disclosure trigger such as **Thought for 4s** with a chevron. \`layout=\"row\"\` only; the default \`fill\` spans the container.",
        },
      },
    },
    `
import { ChevronDown } from "lucide-react";
import { Button } from "@thewhatmatters/wmds";

export function ThoughtToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <Button role="ghost" layout="row" width="hug" type="button" aria-expanded={open} onClick={onToggle}>
      <span>Thought for 4s</span>
      <ChevronDown className="size-4 stroke-current" strokeWidth={2} aria-hidden />
    </Button>
  );
}
    `,
  ),
  render: function RowHugRender() {
    const [open, setOpen] = useState(false);
    return (
      <Button role="ghost" layout="row" width="hug" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span>Thought for 4s</span>
        <ChevronDown className="size-4 stroke-current" strokeWidth={2} aria-hidden />
      </Button>
    );
  },
};

export const SuggestionPills: Story = {
  name: "Pattern — suggestion pills",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Full-width follow-up suggestions: \`role=\"outline\"\` with \`emphasis=\"quiet\"\` (the \`border-border\` hairline) and \`align=\"start\"\` (left-aligned label). Width is layout, so \`className=\"w-full\"\` is fine.",
        },
      },
    },
    `
import { Button } from "@thewhatmatters/wmds";

export function FollowUps({ items, onPick }: { items: string[]; onPick: (item: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Button key={item} role="outline" emphasis="quiet" align="start" size="md" type="button" className="w-full" onClick={() => onPick(item)}>
          {item}
        </Button>
      ))}
    </div>
  );
}
    `,
  ),
  render: () => (
    <div className="flex max-w-md flex-col gap-2">
      {["What would the first release include?", "How long does a project like this take?", "Can you show similar work?"].map((item) => (
        <Button key={item} role="outline" emphasis="quiet" align="start" size="md" type="button" className="w-full" onClick={() => undefined}>
          {item}
        </Button>
      ))}
    </div>
  ),
};

export const DestructiveAction: Story = {
  name: "Pattern — destructive action",
  parameters: storyCopySource(`
import { Button } from "@thewhatmatters/wmds";

<Button role="destructive">Delete account</Button>
  `),
  args: { role: "destructive", children: "Delete account" },
};

export const WithIcon: Story = {
  name: "Pattern — with icon",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "Leading Lucide icon reinforces the label. Icon choice is app-specific; sizing is automatic.",
        },
      },
    },
    `
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@thewhatmatters/wmds";

export function ItemActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button role="primary" icon={<Plus strokeWidth={2} />}>
        New item
      </Button>
      <Button role="secondary" icon={<Pencil strokeWidth={2} />}>
        Edit
      </Button>
      <Button role="destructive" icon={<Trash2 strokeWidth={2} />}>
        Delete
      </Button>
    </div>
  );
}
    `,
  ),
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button role="primary" icon={<Plus strokeWidth={2} />}>
        New item
      </Button>
      <Button role="secondary" icon={<Pencil strokeWidth={2} />}>
        Edit
      </Button>
      <Button role="destructive" icon={<Trash2 strokeWidth={2} />}>
        Delete
      </Button>
    </div>
  ),
};

export const WithCount: Story = {
  name: "Pattern — with count",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "Trailing numeric count for inbox / notification nav actions only.",
        },
      },
    },
    `
import { Button } from "@thewhatmatters/wmds";

<Button role="primary" count={3}>
  Inbox
</Button>
    `,
  ),
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button role="primary" count={3}>
        Inbox
      </Button>
      <Button role="secondary" count={12}>
        Messages
      </Button>
    </div>
  ),
};

export const StatusStates: Story = {
  name: "Reference — status states",
  parameters: {
    docs: {
      description: {
        story: "Visual reference for each `status` value — use Pattern — submit / async in production.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button status="idle">Submit</Button>
      <Button status="loading">Submit</Button>
      <Button status="success">Submit</Button>
      <Button status="error">Submit</Button>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Reference — sizes",
  parameters: {
    docs: {
      description: {
        story: "`md` = 44px min height (touch target). `xs` for dense UI / input adornments.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Reference — disabled",
  args: { children: "Unavailable", disabled: true },
};

export const TokenCheck: Story = {
  name: "Reference — primary token",
  args: { role: "primary", children: "Submit" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /submit/i });
    await expect(getComputedStyle(button).backgroundColor).toBe("rgb(57, 72, 92)");
  },
};
