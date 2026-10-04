import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Prose, proseMeasures, proseSizes } from "./Prose";

/** What a markdown renderer outputs: plain elements, no classes. */
function SampleArticle() {
  return (
    <>
      <p>
        A brand sprint is two weeks with one decision a day. It works when the questions are set before the first
        meeting and the answers are written down the day they are made. This is how we <a href="#scope">scope one</a>.
      </p>
      <h2>Before the sprint</h2>
      <p>
        We ask for three things: who the work is for, what has to be true in a year, and what is already decided. The
        last one matters most — <strong>a sprint cannot reopen a settled question</strong> without losing a day.
      </p>
      <ul>
        <li>The audience, in one sentence.</li>
        <li>
          The outcome, as something you could measure.
          <ul>
            <li>A number, or a behavior you could watch.</li>
          </ul>
        </li>
        <li>The constraints: budget, dates, and what cannot change.</li>
      </ul>
      <h3>The brief</h3>
      <p>
        The brief is one page. It names the decision for each day and who makes it. We keep it in the repository as{" "}
        <code>brief.md</code>, next to the work.
      </p>
      <blockquote>
        <p>A decision a day keeps the sprint honest: nothing waits for a meeting that is not on the calendar.</p>
      </blockquote>
      <pre>
        <code>{`day 1  audience and outcome
day 2  positioning
day 3  name and voice`}</code>
      </pre>
      <ol>
        <li>Write the question.</li>
        <li>Show two answers.</li>
        <li>Pick one, and write down why.</li>
      </ol>
      <hr />
      <h3>What we hand over</h3>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Decision</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Audience and outcome</td>
            <td>Client lead</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Positioning</td>
            <td>Strategy</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Name and voice</td>
            <td>Writing</td>
          </tr>
        </tbody>
      </table>
      <h4>A note on scope</h4>
      <p>If a question needs more than a day, it was two questions. Split it before the sprint starts.</p>
    </>
  );
}

const meta = {
  title: "Components/Prose",
  component: Prose,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "inline-radio", options: [...proseSizes] },
    measure: { control: "inline-radio", options: [...proseMeasures] },
    children: { control: false },
  },
  args: {
    size: "lg",
    measure: "reading",
    children: null,
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Long-form content — an article, a resource page's notes. **Prose** sets the plain HTML elements inside it — the output of a markdown renderer — so the app passes rendered markdown in and keeps no class map.

| Pattern | Props |
|---------|--------|
| **Article** | \`size="lg"\` (default) — \`type-reading\`: 17px at a 28px line, headings a step up |
| **Notes** | \`size="md"\` — \`type-body\` (14px) for denser copy |
| **Reading measure** | \`measure="reading"\` (default) — lines stop at 40rem, about 70 characters at \`lg\` |
| **Element** | \`as\` — \`div\` (default), \`article\`, or \`section\` |

**Body size:** long-form text is \`type-reading\` (17px). At 14px the 40rem measure runs past 90 characters a line; 17px keeps it near 70. UI copy around an article — captions, metadata, buttons — stays on its own type.

## Anatomy

\`\`\`
Prose
├── h2 / h3 / h4–h6 — heading-1 / heading-2 / heading-3 at lg (heading-2 / -3 / -4 at md), more space above than below
├── p, ul, ol (muted markers), blockquote (rule at the start)
├── code — inline chip; pre — code block on the surface, hairline, body radius, scrolls sideways
├── hr — hairline with room on both sides
├── img — fills the measure, body radius; figcaption — caption type
└── table — label heads, hairline rows; a wide table scrolls inside its own box
\`\`\`

Blocks are spaced by one rhythm (24px at \`lg\`, 20px at \`md\`). Links get the **TextLink** prose treatment; map markdown links to **TextLink** when you want \`external\` for other sites.

## Best practices

- **Do** pass rendered markdown in as children; map \`#\` to \`h2\` when the page title is the \`h1\`.
- **Do** map links to **TextLink** with \`external\` for other sites — **Prose** styles a bare \`a\` the same way, without the new-tab handling.
- **Don't** add classes to the elements inside — the article must not carry its own styling.
- **Don't** use it for UI copy — it is for content the reader reads straight through.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArticleBody: Story = {
  name: "Pattern — article body",
  render: () => (
    <Prose as="article">
      <SampleArticle />
    </Prose>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Rendered markdown inside **Prose**: every heading, list, quote, code block, rule, and table here is a plain element with no classes.",
        },
      },
    },
    `
import type { ReactNode } from "react";
import { Prose } from "@thewhatmatters/wmds";

/** Pass the rendered markdown (markdown-to-jsx, MDX, or remark output) as children. */
export function ArticleBody({ children }: { children: ReactNode }) {
  return <Prose as="article">{children}</Prose>;
}
`,
  ),
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: () => (
    <div className="grid gap-12 lg:grid-cols-2">
      {proseSizes.map((size) => (
        <section key={size} className="flex flex-col gap-4">
          <h2 className="type-eyebrow text-muted">size=&quot;{size}&quot;</h2>
          <Prose size={size}>
            <p>
              A brand sprint is two weeks with one decision a day. It works when the questions are set before the first
              meeting and the answers are written down the day they are made.
            </p>
            <h2>Before the sprint</h2>
            <p>
              We ask for three things: who the work is for, what has to be true in a year, and what is already decided.
            </p>
          </Prose>
        </section>
      ))}
    </div>
  ),
};
