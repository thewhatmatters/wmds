import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, avatarSizes } from "./Avatar";
import { avatarSizePx } from "./avatarStyles";
import { Dropdown } from "../../molecules/Dropdown/Dropdown";
import { withStoryCopySource } from "../../../lib/storyCopySource";

const SAMPLE_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: [...avatarSizes] },
    name: { control: "text" },
    src: { control: "text" },
    presence: { control: false },
  },
  args: {
    name: "Ana Thomas",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Circular identity for a person or team — photo, initials, or fallback icon. Presentational only; wrap in **Button** or a link when the avatar should navigate or open a menu.

| Pattern | Props |
|---------|--------|
| **Photo** | \`src\` + \`name\` (required — alt text) |
| **Initials** | \`name\` only |
| **Fallback icon** | \`name\` with no derivable initials (edge case) |
| **Presence** | \`presence={{ tone, label, pulsing? }}\` — online / offline / busy |

### Sizes

| Size | px | When |
|------|-----|------|
| \`xsm\` | 20 | Inline mention beside copy |
| \`sm\` | 24 | **Dropdown** / **Select** row \`start\` |
| \`md\` | 36 | **Default** — pairs with cluster **md** (\`avatarSizeForCluster\`) |
| \`lg\` | 48 | Comment headers, emphasis rows |
| \`xl\` | 128 | Profile / settings hero |

## Anatomy

\`\`\`
Avatar (span, fixed circle)
├── image | initials shell | User icon — first match in fallback chain
└── presence (optional) — 8px dot on circle rim; Status dot tokens + surface ring
\`\`\`

- **Fallback chain:** \`src\` → initials from \`name\` → Lucide **User**
- **Presence:** uses \`statusDotStyles\` — same tones as **Status** \`variant="dot"\`; do not import **Status** inside **Avatar** or hand-roll a dot in molecules
- **Initials:** first letter of first two words, or first two letters of a single word

## Best practices

- **Do** always pass \`name\` — alt text, initials, and screen reader name.
- **Do** use \`presence.label\` with plain copy (\`"Online"\`, \`"Busy"\`) — not icon-only presence.
- **Do** use \`size="sm"\` in **Dropdown.Item** \`start\` for assignee / contact rows — copy **Pattern — dropdown row**.
- **Do** call \`avatarSizeForCluster(tier)\` when the avatar sits in a cluster header row (**Chip** + **IconButton** tier).
- **Don't** make **Avatar** clickable — parent control owns focus and action.
- **Don't** invent sizes or rim-positioned dots — use \`presence\` or **Status** beside a label in text rows.
- **Don't** use **Avatar** for entities without a person/team name — use **Badge** or an icon.

## For agents building UIs

1. Pick the matching **Pattern — …** story; paste its JSX — do not rebuild circles, initials, or dots with utilities.
2. Assignee pickers → **Pattern — dropdown row** (\`Avatar size="sm"\` + **Dropdown.Item**).
3. Presence states → \`presence.tone\` from **Status** tones (\`success\` = available, \`neutral\` = offline, \`destructive\` = busy/DND).
4. \`className\` is layout-only (margin, alignment) — not new sizes or colors.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Photo: Story = {
  name: "Pattern — photo",
  args: {
    src: SAMPLE_PHOTO,
    name: "Ana Thomas",
    size: "lg",
  },
};

export const Initials: Story = {
  name: "Pattern — initials",
  args: {
    name: "Drew Young",
    size: "lg",
  },
};

export const FallbackIcon: Story = {
  name: "Pattern — fallback icon",
  args: {
    name: " ",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Lucide **User** when initials cannot be derived — rare; `name` should normally yield initials.",
      },
    },
  },
};

export const Presence: Story = {
  name: "Pattern — presence",
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      <Avatar
        src={SAMPLE_PHOTO}
        name="Itai Jordaan"
        size="lg"
        presence={{ tone: "success", label: "Online" }}
      />
      <Avatar
        name="Margot Schroder"
        size="lg"
        presence={{ tone: "neutral", label: "Offline" }}
      />
      <Avatar
        name="Pablo Morales"
        size="lg"
        presence={{ tone: "destructive", label: "Busy", pulsing: true }}
      />
    </div>
  ),
};

export const SizesReference: Story = {
  name: "Reference — sizes",
  parameters: { docs: { disable: true } },
  render: () => (
    <ul className="type-body flex flex-col gap-3 text-muted">
      {avatarSizes.map((size) => (
        <li key={size} className="flex items-center gap-3">
          <Avatar name="Ana Thomas" size={size} />
          <span>
            <code>{size}</code> — {avatarSizePx[size]}px
          </span>
        </li>
      ))}
    </ul>
  ),
};

export const DropdownRow: Story = {
  name: "Pattern — dropdown row",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "centered",
      docs: {
        description: {
          story:
            "Assignee / contact picker — **Avatar** `sm` in **Dropdown.Item** `start`. Label duplicates `name` in the row copy.",
        },
      },
    },
    `
import { Avatar, Dropdown } from "@whatmatters/wmds";

function AssigneeMenu() {
  return (
    <Dropdown.Menu role="listbox" aria-label="Assignee">
      <li role="presentation">
        <Dropdown.Item
          role="option"
          start={<Avatar name="Drew Young" size="sm" presence={{ tone: "success", label: "Online" }} />}
        >
          Drew Young
        </Dropdown.Item>
      </li>
    </Dropdown.Menu>
  );
}
`,
  ),
  render: () => (
    <div className="mx-auto w-full max-w-xs px-8 py-6">
      <Dropdown.Menu role="listbox" aria-label="Assignee" className="relative w-full">
        <li role="presentation">
          <Dropdown.Item
            role="option"
            aria-selected
            selected
            start={<Avatar src={SAMPLE_PHOTO} name="Ana Thomas" size="sm" />}
          >
            Ana Thomas
          </Dropdown.Item>
        </li>
        <li role="presentation">
          <Dropdown.Item
            role="option"
            aria-selected={false}
            start={
              <Avatar
                name="Drew Young"
                size="sm"
                presence={{ tone: "success", label: "Online" }}
              />
            }
          >
            Drew Young
          </Dropdown.Item>
        </li>
        <li role="presentation">
          <Dropdown.Item
            role="option"
            aria-selected={false}
            start={<Avatar name="Margot Schroder" size="sm" />}
          >
            Margot Schroder
          </Dropdown.Item>
        </li>
      </Dropdown.Menu>
    </div>
  ),
};
