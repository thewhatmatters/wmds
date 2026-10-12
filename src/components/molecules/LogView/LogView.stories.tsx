import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../../atoms/Badge/Badge";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Stat } from "../Stat/Stat";
import { LogView } from "./LogView";

const scanLog = [
  "09:14:02 connected to etheris",
  "09:14:08 walking /api/orders",
  "09:14:21 12 findings",
  "09:14:22 coverage 76%",
  "09:16:14 delta +8 vs last scan",
  "09:18:02 session closed",
];

const meta = {
  title: "Components/LogView",
  component: LogView,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

**LogView** is a scrolling log: line numbers, a tabular line count, **Copy**, and **Follow**. It composes **Button** and **Skeleton**.

The dark run detail is **Pattern — detail pane**: prev/next **IconButton**, **Badge** tags, **Stat** with \`detail\`, and this log, on \`data-theme="dark"\`.

## Anatomy

\`\`\`
LogView
├── count · Copy · Follow
└── log
    ├── line number (hidden from the name)
    └── line text
\`\`\`

## Best practices

- **Do** pass \`label\` as the accessible name of the log.
- **Do** keep **Follow** controlled so the app decides when new lines arrive.
- **Do** wrap a run detail in \`data-theme="dark"\` when the page should stay dark.
- **Don't** put actions inside a line. Copy and Follow stay in the toolbar.
        `.trim(),
      },
    },
  },
  args: {
    label: "Scan log",
    lines: scanLog,
    follow: true,
    onFollowChange: () => undefined,
  },
} satisfies Meta<typeof LogView>;

export default meta;
type Story = StoryObj<typeof meta>;

const scans = [
  {
    title: "Scan 1842",
    tags: ["API", "Nightly"],
    lines: scanLog,
  },
  {
    title: "Scan 1841",
    tags: ["API", "Nightly"],
    lines: ["08:02:11 connected to etheris", "08:06:40 4 findings", "08:07:01 session closed"],
  },
] as const;

function DetailPaneDemo() {
  const [index, setIndex] = useState(0);
  const [follow, setFollow] = useState(true);
  const scan = scans[index] ?? scans[0];

  return (
    <section
      data-theme="dark"
      className="flex w-full max-w-3xl flex-col gap-4 bg-body p-4 text-fg"
      aria-label="Scan detail"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="type-heading-2">{scan.title}</h2>
        <div className="flex gap-2">
          <IconButton
            aria-label="Previous scan"
            icon={<ChevronLeft />}
            size="sm"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          />
          <IconButton
            aria-label="Next scan"
            icon={<ChevronRight />}
            size="sm"
            disabled={index === scans.length - 1}
            onClick={() => setIndex(index + 1)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {scan.tags.map((tag) => (
          <Badge key={tag} size="sm" emphasis="outline" mono>
            {tag}
          </Badge>
        ))}
      </div>
      <Stat.Group columns={2} aria-label="Scan metrics">
        <Stat label="Findings" value="12" detail="3 new" />
        <Stat label="Coverage" value="76%" detail="of 1,000 paths" />
        <Stat label="Duration" value="4m 12s" detail="started 09:14" />
        <Stat
          label="Delta"
          value="+8"
          trend={{ value: "+8", direction: "up" }}
          detail="vs last scan"
        />
      </Stat.Group>
      <LogView label="Scan log" lines={scan.lines} follow={follow} onFollowChange={setFollow} />
    </section>
  );
}

export const DetailPane: Story = {
  name: "Pattern — detail pane",
  render: () => <DetailPaneDemo />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Run detail forced to dark. Prev and next move between scans. Each **Stat** can carry a `detail` line under the figure. The log counts lines, copies them, and follows the end.",
        },
      },
    },
    `
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, IconButton, LogView, Stat } from "@thewhatmatters/wmds";

const scans = [
  {
    title: "Scan 1842",
    tags: ["API", "Nightly"],
    lines: [
      "09:14:02 connected to etheris",
      "09:14:08 walking /api/orders",
      "09:14:21 12 findings",
      "09:14:22 coverage 76%",
      "09:16:14 delta +8 vs last scan",
      "09:18:02 session closed",
    ],
  },
  {
    title: "Scan 1841",
    tags: ["API", "Nightly"],
    lines: ["08:02:11 connected to etheris", "08:06:40 4 findings", "08:07:01 session closed"],
  },
];

export function DetailPane() {
  const [index, setIndex] = useState(0);
  const [follow, setFollow] = useState(true);
  const scan = scans[index] ?? scans[0];

  return (
    <section
      data-theme="dark"
      className="flex w-full max-w-3xl flex-col gap-4 bg-body p-4 text-fg"
      aria-label="Scan detail"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="type-heading-2">{scan.title}</h2>
        <div className="flex gap-2">
          <IconButton
            aria-label="Previous scan"
            icon={<ChevronLeft />}
            size="sm"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          />
          <IconButton
            aria-label="Next scan"
            icon={<ChevronRight />}
            size="sm"
            disabled={index === scans.length - 1}
            onClick={() => setIndex(index + 1)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {scan.tags.map((tag) => (
          <Badge key={tag} size="sm" emphasis="outline" mono>
            {tag}
          </Badge>
        ))}
      </div>
      <Stat.Group columns={2} aria-label="Scan metrics">
        <Stat label="Findings" value="12" detail="3 new" />
        <Stat label="Coverage" value="76%" detail="of 1,000 paths" />
        <Stat label="Duration" value="4m 12s" detail="started 09:14" />
        <Stat
          label="Delta"
          value="+8"
          trend={{ value: "+8", direction: "up" }}
          detail="vs last scan"
        />
      </Stat.Group>
      <LogView label="Scan log" lines={scan.lines} follow={follow} onFollowChange={setFollow} />
    </section>
  );
}
`,
  ),
};

function LogViewerDemo() {
  const [follow, setFollow] = useState(true);
  return (
    <div className="w-full max-w-xl">
      <LogView label="Scan log" lines={scanLog} follow={follow} onFollowChange={setFollow} />
    </div>
  );
}

export const LogViewer: Story = {
  name: "Pattern — log viewer",
  render: () => <LogViewerDemo />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Line numbers, a tabular count, Copy, and Follow. Follow keeps the scroller on the last line. Loading and an empty log are props on the same component.",
        },
      },
    },
    `
import { useState } from "react";
import { LogView } from "@thewhatmatters/wmds";

const lines = [
  "09:14:02 connected to etheris",
  "09:14:08 walking /api/orders",
  "09:14:21 12 findings",
  "09:14:22 coverage 76%",
  "09:16:14 delta +8 vs last scan",
  "09:18:02 session closed",
];

export function LogViewer() {
  const [follow, setFollow] = useState(true);
  return <LogView label="Scan log" lines={lines} follow={follow} onFollowChange={setFollow} />;
}
`,
  ),
};
