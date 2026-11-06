import { useEffect, useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, X } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { lockedViewportStory } from "../../../lib/viewports";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Card } from "../../molecules/Card/Card";
import { Sheet } from "../../organisms/Sheet/Sheet";
import { dialogFooterActionsClasses } from "../../organisms/Dialog/dialogStyles";
import { TextLink } from "../TextLink/TextLink";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./Table";

type ApprovalDecision = "approved" | "denied";

interface ApprovalItem {
  id: string;
  name: string;
  kind: string;
  waiting: string;
}

const approvalItems: ApprovalItem[] = [
  { id: "maya-chen", name: "Maya Chen", kind: "Creator application", waiting: "3 days" },
  { id: "field-notes-q4", name: "Field notes: Q4 studio update", kind: "Post", waiting: "2 days" },
  { id: "dev-patel", name: "Dev Patel", kind: "Creator application", waiting: "1 day" },
  { id: "launch-week-recap", name: "Launch week recap", kind: "Post", waiting: "5 hours" },
];

type ApprovalView = "table" | "card";

interface ApprovalsQueueProps {
  items: ApprovalItem[];
  onDecision?: (item: ApprovalItem, decision: ApprovalDecision) => void;
}

/** Mirrors **Pattern — approvals queue** Show code below. */
/** The row's buttons. `table` sits them side by side; `card` gives each half the row. */
function ActionGroup({
  label,
  view,
  onEscape,
  children,
}: {
  label: string;
  view: ApprovalView;
  onEscape?: () => void;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={view === "card" ? "grid h-11 grid-cols-2 items-center gap-2" : "flex h-11 items-center gap-2"}
      onKeyDown={(event) => {
        if (event.key === "Escape") onEscape?.();
      }}
    >
      {children}
    </div>
  );
}

function ApprovalsQueue({ items, onDecision }: ApprovalsQueueProps) {
  const [decisions, setDecisions] = useState<Record<string, ApprovalDecision>>({});
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);

  useEffect(() => {
    if (!focusKey) return;
    const targets = document.querySelectorAll<HTMLElement>(`[data-focus="${focusKey}"]`);
    Array.from(targets)
      .find((target) => target.getClientRects().length > 0)
      ?.focus();
  }, [focusKey]);

  const waiting = items.filter((item) => !decisions[item.id]).length;

  function decide(item: ApprovalItem, decision: ApprovalDecision) {
    setDecisions((current) => ({ ...current, [item.id]: decision }));
    setConfirmingId(null);
    setFocusKey(`${item.id}-decision`);
    onDecision?.(item, decision);
  }

  function cancel(item: ApprovalItem) {
    setConfirmingId(null);
    setFocusKey(`${item.id}-deny`);
  }

  function renderDecision(item: ApprovalItem, view: ApprovalView) {
    const decision = decisions[item.id];
    const full = view === "card" ? "w-full" : undefined;
    if (decision) {
      return (
        <div className="flex h-11 items-center">
          <span
            data-focus={`${item.id}-decision`}
            tabIndex={-1}
            className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body"
          >
            <Badge status={decision === "approved" ? "success" : "failed"} dot>
              {decision === "approved" ? "Approved" : "Denied"}
            </Badge>
          </span>
        </div>
      );
    }
    if (confirmingId === item.id) {
      return (
        <ActionGroup label={`Confirm denying ${item.name}`} view={view} onEscape={() => cancel(item)}>
          <Button
            data-focus={`${item.id}-confirm`}
            role="primary"
            icon={<X />}
            className={full}
            aria-label={`Confirm deny ${item.name}`}
            onClick={() => decide(item, "denied")}
          >
            Confirm deny
          </Button>
          <Button role="ghost" className={full} aria-label={`Cancel deny ${item.name}`} onClick={() => cancel(item)}>
            Cancel
          </Button>
        </ActionGroup>
      );
    }
    return (
      <ActionGroup label={`Actions for ${item.name}`} view={view}>
        <Button
          role="primary"
          icon={<Check />}
          className={full}
          aria-label={`Approve ${item.name}`}
          onClick={() => decide(item, "approved")}
        >
          Approve
        </Button>
        <Button
          data-focus={`${item.id}-deny`}
          role="outline"
          icon={<X />}
          className={full}
          aria-label={`Deny ${item.name}`}
          onClick={() => {
            setConfirmingId(item.id);
            setFocusKey(`${item.id}-confirm`);
          }}
        >
          Deny
        </Button>
      </ActionGroup>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <p className="mb-3 text-muted">{waiting} waiting on you</p>
        {items.length === 0 ? (
          <Card variant="outlined" padding="md">
            <p className="text-center">Nothing waiting on you</p>
          </Card>
        ) : (
          <ul aria-label="Approvals waiting on you" className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <Card variant="outlined" padding="md">
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted">
                        {item.kind} · Waiting {item.waiting}
                      </p>
                    </div>
                    {renderDecision(item, "card")}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="hidden md:block">
        <Table aria-label="Approvals waiting on you">
          <TableCaption>{waiting} waiting on you</TableCaption>
          <colgroup>
            <col className="w-40" />
            <col className="w-44" />
            <col className="w-32" />
            <col className="w-72" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead sticky>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Waiting</TableHead>
              <TableHead>Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nothing waiting on you
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sticky>{item.name}</TableCell>
                  <TableCell>{item.kind}</TableCell>
                  <TableCell>{item.waiting}</TableCell>
                  <TableCell>{renderDecision(item, "table")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

const approvalsCode = `
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@thewhatmatters/wmds";

export type ApprovalDecision = "approved" | "denied";

export interface ApprovalItem {
  id: string;
  name: string;
  kind: string;
  waiting: string;
}

export interface ApprovalsQueueProps {
  items: ApprovalItem[];
  onDecision?: (item: ApprovalItem, decision: ApprovalDecision) => void;
}

type ApprovalView = "table" | "card";

/** The row's buttons. \`table\` sits them side by side; \`card\` gives each half the row. */
function ActionGroup({
  label,
  view,
  onEscape,
  children,
}: {
  label: string;
  view: ApprovalView;
  onEscape?: () => void;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={view === "card" ? "grid h-11 grid-cols-2 items-center gap-2" : "flex h-11 items-center gap-2"}
      onKeyDown={(event) => {
        if (event.key === "Escape") onEscape?.();
      }}
    >
      {children}
    </div>
  );
}

export function ApprovalsQueue({ items, onDecision }: ApprovalsQueueProps) {
  const [decisions, setDecisions] = useState<Record<string, ApprovalDecision>>({});
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);

  useEffect(() => {
    if (!focusKey) return;
    const targets = document.querySelectorAll<HTMLElement>(\`[data-focus="\${focusKey}"]\`);
    Array.from(targets)
      .find((target) => target.getClientRects().length > 0)
      ?.focus();
  }, [focusKey]);

  const waiting = items.filter((item) => !decisions[item.id]).length;

  function decide(item: ApprovalItem, decision: ApprovalDecision) {
    setDecisions((current) => ({ ...current, [item.id]: decision }));
    setConfirmingId(null);
    setFocusKey(\`\${item.id}-decision\`);
    onDecision?.(item, decision);
  }

  function cancel(item: ApprovalItem) {
    setConfirmingId(null);
    setFocusKey(\`\${item.id}-deny\`);
  }

  function renderDecision(item: ApprovalItem, view: ApprovalView) {
    const decision = decisions[item.id];
    const full = view === "card" ? "w-full" : undefined;
    if (decision) {
      return (
        <div className="flex h-11 items-center">
          <span
            data-focus={\`\${item.id}-decision\`}
            tabIndex={-1}
            className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body"
          >
            <Badge status={decision === "approved" ? "success" : "failed"} dot>
              {decision === "approved" ? "Approved" : "Denied"}
            </Badge>
          </span>
        </div>
      );
    }
    if (confirmingId === item.id) {
      return (
        <ActionGroup label={\`Confirm denying \${item.name}\`} view={view} onEscape={() => cancel(item)}>
          <Button
            data-focus={\`\${item.id}-confirm\`}
            role="primary"
            icon={<X />}
            className={full}
            aria-label={\`Confirm deny \${item.name}\`}
            onClick={() => decide(item, "denied")}
          >
            Confirm deny
          </Button>
          <Button role="ghost" className={full} aria-label={\`Cancel deny \${item.name}\`} onClick={() => cancel(item)}>
            Cancel
          </Button>
        </ActionGroup>
      );
    }
    return (
      <ActionGroup label={\`Actions for \${item.name}\`} view={view}>
        <Button
          role="primary"
          icon={<Check />}
          className={full}
          aria-label={\`Approve \${item.name}\`}
          onClick={() => decide(item, "approved")}
        >
          Approve
        </Button>
        <Button
          data-focus={\`\${item.id}-deny\`}
          role="outline"
          icon={<X />}
          className={full}
          aria-label={\`Deny \${item.name}\`}
          onClick={() => {
            setConfirmingId(item.id);
            setFocusKey(\`\${item.id}-confirm\`);
          }}
        >
          Deny
        </Button>
      </ActionGroup>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <p className="mb-3 text-muted">{waiting} waiting on you</p>
        {items.length === 0 ? (
          <Card variant="outlined" padding="md">
            <p className="text-center">Nothing waiting on you</p>
          </Card>
        ) : (
          <ul aria-label="Approvals waiting on you" className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <Card variant="outlined" padding="md">
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted">
                        {item.kind} · Waiting {item.waiting}
                      </p>
                    </div>
                    {renderDecision(item, "card")}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="hidden md:block">
        <Table aria-label="Approvals waiting on you">
          <TableCaption>{waiting} waiting on you</TableCaption>
          <colgroup>
            <col className="w-40" />
            <col className="w-44" />
            <col className="w-32" />
            <col className="w-72" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead sticky>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Waiting</TableHead>
              <TableHead>Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nothing waiting on you
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sticky>{item.name}</TableCell>
                  <TableCell>{item.kind}</TableCell>
                  <TableCell>{item.waiting}</TableCell>
                  <TableCell>{renderDecision(item, "table")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
`;

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Semantic table in a horizontal-scroll box. Use it for rows that share columns — posts, creators, approvals. For a list of facts about one thing use **DescriptionList**; for expandable task status use **TaskRows**.

| Piece | Element |
|-------|---------|
| **Table** | \`div\` (focusable \`region\`, scrolls sideways) around a \`table\` |
| **TableCaption** | \`caption\` — what the table is, or a count |
| **TableHeader** / **TableBody** / **TableFooter** | \`thead\` / \`tbody\` / \`tfoot\` |
| **TableRow** | \`tr\` — hairline rule, ghost hover fill |
| **TableHead** | \`th\` (\`scope="col"\`; pass \`scope="row"\` for a row header) — \`sticky\` pins the column to the start edge |
| **TableCell** | \`td\` — \`align\` \`start\` (default) / \`center\` / \`end\` (tabular figures); \`sticky\` as on TableHead |

## Anatomy

\`\`\`
Table (div region → table)
├── TableCaption
├── TableHeader → TableRow → TableHead…
├── TableBody → TableRow → TableCell…
└── TableFooter → TableRow → TableCell…
\`\`\`

## Best practices

- **Do** name every table with \`aria-label\` or \`aria-labelledby\` — it names the scrolling region too.
- **Do** put status in a **Badge** \`status\` pill and actions in **Button**; the cell adds no style of its own.
- **Do** right-align figures with \`align="end"\`.
- **Do** put a \`colgroup\` of \`col\` widths after the caption when the table can be empty or its cells change — the table then lays out from those widths, so the empty and filled states match.
- **Do** set \`sticky\` on every cell of the first column of a wide table so it stays in view on a phone.
- **Do** show an empty row ("Nothing waiting on you") rather than a bare header.
- **Don't** pass colors, borders, or type classes through \`className\` — it is layout only.
- **Don't** use it for page layout, or for a decision that needs a dialog — see **Pattern — approvals queue** for an inline confirm.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "Pattern — basic table",
  args: { children: null },
  render: () => (
    <Table aria-label="Recent posts">
      <TableCaption>Posts from the last 30 days</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Post</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="end">Words</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Field notes: Q4 studio update</TableCell>
          <TableCell>Randy Lee</TableCell>
          <TableCell>
            <Badge status="success" dot>
              Published
            </Badge>
          </TableCell>
          <TableCell align="end">1,240</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Launch week recap</TableCell>
          <TableCell>Maya Chen</TableCell>
          <TableCell>
            <Badge status="warning" dot>
              In review
            </Badge>
          </TableCell>
          <TableCell align="end">860</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Designing for slow mornings</TableCell>
          <TableCell>Dev Patel</TableCell>
          <TableCell>
            <Badge status="idle">Draft</Badge>
          </TableCell>
          <TableCell align="end">2,015</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell align="end">4,115</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "Caption, header, rows with a status pill, and a footer total. Figures align to the end.",
        },
      },
    },
    `
import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@thewhatmatters/wmds";

export interface PostRow {
  id: string;
  title: string;
  author: string;
  status: "success" | "warning" | "idle";
  statusLabel: string;
  words: string;
}

export function RecentPosts({ posts, total }: { posts: PostRow[]; total: string }) {
  return (
    <Table aria-label="Recent posts">
      <TableCaption>Posts from the last 30 days</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Post</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="end">Words</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.author}</TableCell>
            <TableCell>
              <Badge status={post.status} dot={post.status !== "idle"}>
                {post.statusLabel}
              </Badge>
            </TableCell>
            <TableCell align="end">{post.words}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell align="end">{total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
`,
  ),
};

export const GridRules: Story = {
  name: "Rules — grid (a pricing grid)",
  args: { children: null },
  render: () => (
    <Table aria-label="What each package includes" rules="grid">
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Feature</span>
          </TableHead>
          {["Starter site", "Business site"].map((name, index) => (
            <TableHead key={name} wrap>
              <span className="flex flex-col gap-4">
                <span className="type-heading-3 text-fg">{name}</span>
                <span className="type-display-3 tabular-nums text-fg">{index === 0 ? "$6,800" : "$12,400"}</span>
                <Button role={index === 1 ? "primary" : "outline"} size="lg">
                  Start a {name}
                </Button>
              </span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead scope="row">Pages</TableHead>
          <TableCell>Up to 5</TableCell>
          <TableCell>Up to 12</TableCell>
        </TableRow>
        <TableRow>
          <TableHead scope="row">Copy written for you</TableHead>
          <TableCell>—</TableCell>
          <TableCell>Included</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`rules=\"grid\"` rules every column and the outside, and a `colgroup` makes the columns equal, so the packages head the same columns as the rows under them. `wrap` on a header cell lets it hold a heading, a price and a button.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table");
    await expect(table.getAttribute("data-rules")).toBe("grid");
    // Every cell has a rule on its side, and the outside is ruled.
    const cells = [...table.querySelectorAll("th, td")];
    for (const cell of cells) await expect(getComputedStyle(cell).borderLeftWidth).toBe("1px");
    await expect(getComputedStyle(table).borderTopWidth).toBe("1px");
    // Equal columns: the colgroup turns on fixed layout.
    const header = [...table.querySelectorAll("thead th")] as HTMLElement[];
    await expect(Math.abs(header[1].offsetWidth - header[2].offsetWidth)).toBeLessThanOrEqual(1);
    await expect(Math.abs(header[0].offsetWidth - header[1].offsetWidth)).toBeLessThanOrEqual(1);
    // It fits its box: no sideways scroll in the region around it.
    const region = canvas.getByRole("region", { name: "What each package includes" });
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth);
    // The same inset in every cell, so a column lines up from its header down.
    const bodyCell = table.querySelector("tbody td") as HTMLElement;
    await expect(getComputedStyle(bodyCell).paddingLeft).toBe(getComputedStyle(header[1]).paddingLeft);
    // A wrap header holds its button and sits at the top.
    await expect(getComputedStyle(header[1]).verticalAlign).toBe("top");
    await expect(within(header[1]).getByRole("button", { name: "Start a Starter site" })).toBeInTheDocument();
  },
};

export const GridStickyHeader: Story = {
  name: "Rules — grid, sticky header",
  args: { children: null },
  render: () => (
    <Table aria-label="Long comparison" rules="grid" stickyHeader>
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Feature</span>
          </TableHead>
          <TableHead wrap>Starter site</TableHead>
          <TableHead wrap>Business site</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 40 }, (_, index) => (
          <TableRow key={index}>
            <TableHead scope="row">Feature {index + 1}</TableHead>
            <TableCell>—</TableCell>
            <TableCell>Included</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`stickyHeader` with `rules=\"grid\"`: the header row stays at the top of the page while the rows scroll under it, so every row's column is clear. Set `--table-sticky-top` on a parent to sit it under a fixed nav.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const head = canvasElement.querySelector("thead") as HTMLElement;
    await expect(getComputedStyle(head).position).toBe("sticky");
    // The scroll box lets go of its overflow, so the header sticks to the page, not the box.
    const region = canvas.getByRole("region", { name: "Long comparison" });
    await expect(getComputedStyle(region).overflowX).toBe("visible");
    // Scrolled well past the table's top, the header is still at the top of the window.
    const scroller = document.scrollingElement as HTMLElement;
    scroller.scrollTop = head.getBoundingClientRect().top + scroller.scrollTop + 600;
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    await expect(Math.round(head.getBoundingClientRect().top)).toBe(0);
    scroller.scrollTop = 0;
  },
};

export const Approvals: Story = {
  name: "Pattern — approvals queue",
  args: { children: null },
  render: () => <ApprovalsQueue items={approvalItems} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Creators and posts waiting on you. Approve (primary) decides at once. Deny (outline) swaps the row's actions for Confirm deny and Cancel — no dialog. Focus moves to Confirm deny, Escape or Cancel returns it to Deny, and a decided row shows a status pill. Each button's name includes the row name.",
        },
      },
    },
    approvalsCode,
  ),
};

export const DenyConfirm: Story = {
  name: "Approvals — deny confirm step",
  args: { children: null },
  render: () => <ApprovalsQueue items={approvalItems} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Deny Maya Chen" }));
    const confirm = await canvas.findByRole("button", { name: "Confirm deny Maya Chen" });
    await expect(confirm).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(await canvas.findByRole("button", { name: "Deny Maya Chen" })).toHaveFocus();
    await userEvent.click(canvas.getByRole("button", { name: "Deny Maya Chen" }));
  },
};

export const Decided: Story = {
  name: "Approvals — decided",
  args: { children: null },
  render: () => <ApprovalsQueue items={approvalItems} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = within(canvas.getByRole("region", { name: "Approvals waiting on you" }));
    await userEvent.click(canvas.getByRole("button", { name: "Approve Maya Chen" }));
    await expect(table.getByText("Approved")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Deny Dev Patel" }));
    await userEvent.click(await canvas.findByRole("button", { name: "Confirm deny Dev Patel" }));
    await expect(table.getByText("Denied")).toBeVisible();
    await expect(table.getByText("2 waiting on you")).toBeVisible();
  },
};

export const Empty: Story = {
  name: "Approvals — empty",
  args: { children: null },
  render: () => <ApprovalsQueue items={[]} />,
};

export const Mobile: Story = {
  name: "Approvals — mobile 390",
  args: { children: null },
  render: () => (
    <div className="p-4">
      <ApprovalsQueue items={approvalItems} />
    </div>
  ),
  ...lockedViewportStory("mobile"),
};

const approvalsWithSheetCode = `
import { useState } from "react";
import {
  Button,
  Sheet,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextLink,
  dialogFooterActionsClasses,
} from "@thewhatmatters/wmds";

interface ApprovalRow {
  id: string;
  name: string;
  kind: string;
  waiting: string;
}

export function ApprovalsWithSheet({ rows }: { rows: ApprovalRow[] }) {
  const [id, setId] = useState<string | null>(null);
  const row = rows.find((item) => item.id === id);

  return (
    <>
      <Table aria-label="Approvals waiting on you">
        <TableCaption>{rows.length} waiting on you</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead align="end">Waiting</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id} onClick={() => setId(item.id)}>
              <TableCell>
                <TextLink
                  variant="quiet"
                  href={\`#\${item.id}\`}
                  onClick={(event) => event.preventDefault()}
                >
                  {item.name}
                </TextLink>
              </TableCell>
              <TableCell>{item.kind}</TableCell>
              <TableCell align="end">{item.waiting}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Sheet open={row != null} onOpenChange={(open) => setId(open ? id : null)}>
        <Sheet.Content
          side="end"
          title={row?.name}
          description={row?.kind}
          footer={
            <div className={dialogFooterActionsClasses}>
              <Button size="sm" role="outline" onClick={() => setId(null)}>
                Deny
              </Button>
              <Button size="sm" role="primary" onClick={() => setId(null)}>
                Approve
              </Button>
            </div>
          }
        >
          <p>Waiting {row?.waiting}.</p>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
`;

export const ApprovalsWithSheet: Story = {
  name: "Pattern — approvals with sheet",
  args: { children: null },
  render: function ApprovalsWithSheetPattern() {
    const [id, setId] = useState<string | null>(null);
    const row = approvalItems.find((item) => item.id === id);

    return (
      <>
        <Table aria-label="Approvals waiting on you">
          <TableCaption>{approvalItems.length} waiting on you</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead align="end">Waiting</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvalItems.map((item) => (
              <TableRow key={item.id} onClick={() => setId(item.id)}>
                <TableCell>
                  <TextLink variant="quiet" href={`#${item.id}`} onClick={(event) => event.preventDefault()}>
                    {item.name}
                  </TextLink>
                </TableCell>
                <TableCell>{item.kind}</TableCell>
                <TableCell align="end">{item.waiting}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Sheet open={row != null} onOpenChange={(open) => setId(open ? id : null)}>
          <Sheet.Content
            side="end"
            title={row?.name}
            description={row?.kind}
            footer={
              <div className={dialogFooterActionsClasses}>
                <Button size="sm" role="outline" onClick={() => setId(null)}>
                  Deny
                </Button>
                <Button size="sm" role="primary" onClick={() => setId(null)}>
                  Approve
                </Button>
              </div>
            }
          >
            <p>Waiting {row?.waiting}.</p>
          </Sheet.Content>
        </Sheet>
      </>
    );
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A row click sets the sheet id. The name is a link so the row has a focus stop and the sheet returns focus to it on close. Table takes no new props.",
        },
      },
    },
    approvalsWithSheetCode,
  ),
};
