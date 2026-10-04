import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import {
  DescriptionList,
  descriptionListLayouts,
  descriptionListRules,
  descriptionListVariants,
} from "./DescriptionList";

const meta = {
  title: "Components/DescriptionList",
  component: DescriptionList,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    layout: { control: "inline-radio", options: [...descriptionListLayouts] },
    rule: { control: "inline-radio", options: [...descriptionListRules] },
    variant: { control: "inline-radio", options: [...descriptionListVariants] },
    children: { control: false },
  },
  args: {
    layout: "inline",
    rule: "solid",
    variant: "sans",
    children: null,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

A list of facts — each row a name and a value, with a rule between rows. Renders \`dl\`, \`dt\`, and \`dd\`, so screen readers announce the pairs.

| Pattern | Props |
|---------|--------|
| **Details** | \`variant="sans"\` (default) — caption name, body value |
| **Metadata** | \`variant="mono"\` — eyebrow name, mono caps value with tabular figures |
| **Inline row** | \`layout="inline"\` (default) — the value beside the name, on 2 : 3 tracks |
| **Stacked row** | \`layout="stacked"\` on the list or one **DescriptionList.Item** — the value under the name (tags, actions) |
| **Rule** | \`rule\` — \`solid\` (default), \`dotted\` (quieter), or \`none\` |

## Anatomy

\`\`\`
DescriptionList (dl)
└── DescriptionList.Item (div — rule under the row)
    ├── name (dt) — caption or eyebrow
    └── value (dd) — text, Badge tags, or Button actions; several wrap in a row
\`\`\`

## Best practices

- **Do** put dates in a \`<time dateTime>\` and authors or categories in **Badge** \`emphasis="outline"\` \`mono\`.
- **Do** stack a row whose value is a set of actions — buttons need the width.
- **Do** use \`rule="dotted"\` when the list sits beside heavier rules (a caption's, a page's) and should read quieter.
- **Don't** use it for form fields — **Field**; for a metric — **Stat**; for status rows — **TaskRows**.
- **Don't** restyle names or values with \`className\` — it is layout only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Details: Story = {
  name: "Pattern — details",
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionList.Item name="Client">Northwind Health</DescriptionList.Item>
      <DescriptionList.Item name="Scope">Brand, site, design system</DescriptionList.Item>
      <DescriptionList.Item name="Timeline">12 weeks</DescriptionList.Item>
    </DescriptionList>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "Plain name-and-value rows: a caption name beside a body value, solid rules.",
        },
      },
    },
    `
import { DescriptionList } from "@thewhatmatters/wmds";

export interface ProjectDetails {
  client: string;
  scope: string;
  timeline: string;
}

export function ProjectFacts({ project }: { project: ProjectDetails }) {
  return (
    <DescriptionList>
      <DescriptionList.Item name="Client">{project.client}</DescriptionList.Item>
      <DescriptionList.Item name="Scope">{project.scope}</DescriptionList.Item>
      <DescriptionList.Item name="Timeline">{project.timeline}</DescriptionList.Item>
    </DescriptionList>
  );
}
`,
  ),
};

export const PostMetadata: Story = {
  name: "Pattern — post metadata",
  render: () => (
    <DescriptionList variant="mono" rule="dotted">
      <DescriptionList.Item name="Date">
        <time dateTime="2026-09-14">Sep 14, 2026</time>
      </DescriptionList.Item>
      <DescriptionList.Item name="Author">
        <Badge emphasis="outline" mono>
          Randy Lee
        </Badge>
      </DescriptionList.Item>
      <DescriptionList.Item name="Reading time">6 min</DescriptionList.Item>
      <DescriptionList.Item name="Categories">
        <Badge emphasis="outline" mono render={<a href="#guides" />}>
          Guides
        </Badge>
        <Badge emphasis="outline" mono render={<a href="#design-systems" />}>
          Design systems
        </Badge>
      </DescriptionList.Item>
      <DescriptionList.Item name="Share" layout="stacked">
        <Button role="secondary" size="sm" external render={<a href="https://x.com/" />}>
          Twitter/X
        </Button>
        <Button role="secondary" size="sm" external render={<a href="https://www.linkedin.com/" />}>
          LinkedIn
        </Button>
      </DescriptionList.Item>
    </DescriptionList>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Editorial metadata: eyebrow names, mono caps values, dotted rules. Tags are outline **Badge** links; the Share row stacks its **Button** links under the name.",
        },
      },
    },
    `
import { Badge, Button, DescriptionList } from "@thewhatmatters/wmds";

export interface PostMetadataProps {
  /** ISO date, for the time element. */
  date: string;
  dateLabel: string;
  author: string;
  readingTime: string;
  categories: { label: string; href: string }[];
  shareUrl: string;
}

export function PostMetadata({ date, dateLabel, author, readingTime, categories, shareUrl }: PostMetadataProps) {
  const encodedUrl = encodeURIComponent(shareUrl);
  return (
    <DescriptionList variant="mono" rule="dotted">
      <DescriptionList.Item name="Date">
        <time dateTime={date}>{dateLabel}</time>
      </DescriptionList.Item>
      <DescriptionList.Item name="Author">
        <Badge emphasis="outline" mono>
          {author}
        </Badge>
      </DescriptionList.Item>
      <DescriptionList.Item name="Reading time">{readingTime}</DescriptionList.Item>
      <DescriptionList.Item name="Categories">
        {categories.map((category) => (
          <Badge key={category.href} emphasis="outline" mono render={<a href={category.href} />}>
            {category.label}
          </Badge>
        ))}
      </DescriptionList.Item>
      <DescriptionList.Item name="Share" layout="stacked">
        <Button role="secondary" size="sm" external render={<a href={"https://x.com/intent/post?url=" + encodedUrl} />}>
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
      </DescriptionList.Item>
    </DescriptionList>
  );
}
`,
  ),
};

export const Rules: Story = {
  name: "Reference — rules",
  render: () => (
    <div className="flex flex-col gap-10">
      {descriptionListRules.map((rule) => (
        <section key={rule} className="flex flex-col gap-2">
          <h2 className="type-eyebrow text-muted">rule=&quot;{rule}&quot;</h2>
          <DescriptionList rule={rule} variant="mono">
            <DescriptionList.Item name="Date">Sep 14, 2026</DescriptionList.Item>
            <DescriptionList.Item name="Reading time">6 min</DescriptionList.Item>
          </DescriptionList>
        </section>
      ))}
    </div>
  ),
};

export const Stacked: Story = {
  name: "Reference — stacked rows",
  render: () => (
    <DescriptionList layout="stacked">
      <DescriptionList.Item name="Summary">
        Two weeks, one decision a day: the questions we ask before a sprint starts and what we hand over at the end.
      </DescriptionList.Item>
      <DescriptionList.Item name="Deliverables">
        <Badge emphasis="outline">Strategy</Badge>
        <Badge emphasis="outline">Identity</Badge>
        <Badge emphasis="outline">Site</Badge>
      </DescriptionList.Item>
    </DescriptionList>
  ),
};
