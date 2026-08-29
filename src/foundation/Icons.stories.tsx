import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Bell,
  Check,
  ChevronRight,
  Download,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

/** Matches `buttonIconSizeClasses` in Button — documented here to keep Foundation layer-clean. */
const buttonIconScale = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-4",
  lg: "size-[1.125rem]",
} as const;

const meta = {
  title: "Foundation/Icons",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "WMDS uses **[Lucide](https://lucide.dev/icons/)** exclusively until further notice. " +
          "Import named icons from **`lucide-react`** in components, stories, and examples — no custom SVG sets or alternate icon libraries without an ADR. " +
          "Icons inherit foreground via **`stroke-current`**; pass them through slot props or wrap with **`ButtonIcon`** for button-sized glyphs.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleIcons = [
  { Icon: Plus, label: "Add" },
  { Icon: Pencil, label: "Edit" },
  { Icon: Trash2, label: "Delete" },
  { Icon: Download, label: "Download" },
  { Icon: Search, label: "Search" },
  { Icon: Bell, label: "Notifications" },
  { Icon: Check, label: "Confirm" },
  { Icon: X, label: "Close" },
  { Icon: ChevronRight, label: "Forward" },
];

export const Usage: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-4 text-sm text-fg">
      <pre className="overflow-x-auto rounded-md border border-border bg-surface p-3 font-mono text-xs">
        {`import { Plus } from "lucide-react";

<Button icon={<Plus strokeWidth={2} />}>New item</Button>`}
      </pre>
      <p className="text-muted">
        Prefer <code className="font-mono text-xs">strokeWidth={"{2}"}</code> on 16–18px glyphs;
        use <code className="font-mono text-xs">strokeWidth={"{3}"}</code> inside small containers
        like StatusDot.
      </p>
    </div>
  ),
};

export const Catalog: Story = {
  render: () => (
    <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-4 md:grid-cols-5">
      {sampleIcons.map(({ Icon, label }) => (
        <li
          key={label}
          className="flex flex-col items-center gap-2 rounded-md border border-border bg-surface px-3 py-4 text-center"
        >
          <Icon className="size-5 stroke-current" strokeWidth={2} aria-hidden />
          <span className="text-xs text-muted">{label}</span>
        </li>
      ))}
    </ul>
  ),
};

export const ButtonScale: Story = {
  name: "Button icon scale",
  parameters: {
    docs: {
      description: {
        story:
          "Reference scale for button-leading icons — mirrored in `buttonIconSizeClasses` on the Button atom.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {(Object.keys(buttonIconScale) as Array<keyof typeof buttonIconScale>).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Plus className={`stroke-current ${buttonIconScale[size]}`} strokeWidth={2} aria-hidden />
          <span className="font-mono text-xs text-muted">{size}</span>
        </div>
      ))}
    </div>
  ),
};
