import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { TextLink } from "../../atoms/TextLink/TextLink";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Notice, noticeTones } from "./Notice";

const meta = {
  title: "Components/Notice",
  component: Notice,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-xl px-8 py-6">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    tone: { control: "select", options: noticeTones },
    title: { control: "text" },
    children: { control: "text" },
    dismissible: { control: "boolean" },
    live: { control: "boolean" },
  },
  args: {
    tone: "info",
    title: "Closed Thanksgiving Day",
    children: "We reopen Friday, November 27 at 11am.",
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

An inline callout that sits in the page: a holiday closure or a private buyout on a restaurant site, "account not connected" or "sync failed" in an app. It is part of the layout, not a floating message — for a short-lived confirmation use **Toast**; for a field's validation use **Input** \`status\`.

| Tone | Use for |
|------|---------|
| \`neutral\` | A plain aside |
| \`info\` | Something the visitor should know (hours change, a buyout) |
| \`success\` | A finished step that stays on the page |
| \`warning\` | Something that needs attention soon (account not connected) |
| \`error\` | Something failed (sync failed) |

## Anatomy

\`\`\`
Notice
├── Badge (iconOnly, tone colour) — Info, CircleCheck, TriangleAlert, or CircleX; \`icon\` replaces it, \`false\` removes it
├── content
│   ├── title — ui-label, text-fg
│   ├── children — caption, text-muted
│   └── action — a TextLink or a small Button, under the copy
└── IconButton (ghost, xs) — Dismiss, when \`dismissible\`
\`\`\`

The fill is the tone's colour mixed into the current surface, so the copy keeps its contrast in dark mode and inside a toned section.

## Best practices

- **Do** keep the title to one line and the copy to one or two sentences.
- **Do** set \`dismissKey\` for a notice that should stay gone (a holiday banner). Change the key for the next notice.
- **Do** set \`live\` only when the notice appears after the page loads, so screen readers announce it. A notice that is part of the page is read in order and is not announced.
- **Don't** use \`error\` for emphasis. It is for something that failed.
- **Don't** stack more than one notice in a section. Merge them, or keep the most important.
- **Don't** restyle with \`className\` — it is layout only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {noticeTones.map((tone) => (
        <Notice key={tone} tone={tone} title={`${tone[0].toUpperCase()}${tone.slice(1)} notice`}>
          One or two sentences of supporting copy.
        </Notice>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: "The five tones, in light. Switch the theme to see dark." } },
  },
};

export const HolidayClosure: Story = {
  name: "Pattern — holiday closure",
  args: {
    tone: "info",
    title: "Closed Thanksgiving Day",
    children: "We reopen Friday, November 27 at 11am.",
    dismissible: true,
    dismissKey: "thanksgiving-2026",
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A dismissible closure note above the hours. `dismissKey` remembers the dismissal in `localStorage`, so it stays gone on the next visit; change the key for the next holiday. Focus moves to the next control after Dismiss.",
        },
      },
    },
    `
import { Notice } from "@thewhatmatters/wmds";

export function HolidayNotice() {
  return (
    <Notice
      tone="info"
      title="Closed Thanksgiving Day"
      dismissible
      dismissKey="thanksgiving-2026"
    >
      We reopen Friday, November 27 at 11am.
    </Notice>
  );
}
`,
  ),
};

export const PrivateBuyout: Story = {
  name: "Pattern — private buyout",
  args: {
    tone: "warning",
    title: "Private event Saturday night",
    children: "The dining room is booked from 6pm. The bar is open as usual.",
    action: <TextLink href="/events">Book your own event</TextLink>,
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "A warning with a link under the copy. The link wraps at 390px instead of squeezing the text.",
        },
      },
    },
    `
import { Notice, TextLink } from "@thewhatmatters/wmds";

export function BuyoutNotice() {
  return (
    <Notice
      tone="warning"
      title="Private event Saturday night"
      action={<TextLink href="/events">Book your own event</TextLink>}
    >
      The dining room is booked from 6pm. The bar is open as usual.
    </Notice>
  );
}
`,
  ),
};

export const AccountNotConnected: Story = {
  name: "Pattern — account not connected",
  args: {
    tone: "warning",
    title: "Instagram isn't connected",
    children: "Connect your account to show reach and saves on your media kit.",
    action: (
      <Button role="secondary" size="sm">
        Connect Instagram
      </Button>
    ),
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "An app notice with a small **Button**. The app owns the click.",
        },
      },
    },
    `
import { Button, Notice } from "@thewhatmatters/wmds";

export function ConnectNotice({ onConnect }: { onConnect: () => void }) {
  return (
    <Notice
      tone="warning"
      title="Instagram isn't connected"
      action={
        <Button role="secondary" size="sm" onClick={onConnect}>
          Connect Instagram
        </Button>
      }
    >
      Connect your account to show reach and saves on your media kit.
    </Notice>
  );
}
`,
  ),
};

export const SyncFailed: Story = {
  name: "Pattern — sync failed",
  args: {
    tone: "error",
    title: "Sync failed",
    children: "We couldn't reach Instagram. Your numbers are from yesterday.",
    live: true,
    dismissible: true,
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Shown after a failed refresh, so `live` is on: an `error` notice is `role=\"alert\"` and is announced as it appears.",
        },
      },
    },
    `
import { Notice } from "@thewhatmatters/wmds";

export function SyncFailedNotice({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Notice tone="error" title="Sync failed" live dismissible onDismiss={onDismiss}>
      We couldn&apos;t reach Instagram. Your numbers are from yesterday.
    </Notice>
  );
}
`,
  ),
};
