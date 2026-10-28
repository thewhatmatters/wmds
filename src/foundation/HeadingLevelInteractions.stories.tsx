import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SectionCaption } from "../components/atoms/SectionCaption/SectionCaption";
import { PageHeader } from "../components/molecules/PageHeader/PageHeader";

/**
 * Headings rule H1 (levels by outline, never by size) and Eyebrow rule E6 (an eyebrow is never a
 * heading) — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Heading levels",
  tags: ["test", "!dev", "!autodocs"],
  parameters: { docs: { disable: true }, wmdsLayout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LevelsFollowTheOutline: Story = {
  name: "PageHeader takes its level from the outline; SectionCaption is not a heading",
  render: () => (
    <main>
      <PageHeader variant="app" title="Clients" />
      <section aria-labelledby="caption">
        <SectionCaption id="caption">Recent work</SectionCaption>
        <PageHeader variant="page" title="Projects" />
        <PageHeader variant="page" as="h3" title="Archived" />
      </section>
    </main>
  ),
  play: async ({ canvas, canvasElement }) => {
    expect(canvas.getByRole("heading", { level: 1, name: "Clients" })).toBeTruthy();
    expect(canvas.getByRole("heading", { level: 2, name: "Projects" })).toBeTruthy();
    expect(canvas.getByRole("heading", { level: 3, name: "Archived" })).toBeTruthy();
    // The caption still names its region, without adding a level to the outline.
    expect(canvas.getByRole("region", { name: "Recent work" })).toBeTruthy();
    expect(canvas.queryByRole("heading", { name: /Recent work/ })).toBeNull();
    // No skipped levels.
    const levels = [...canvasElement.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1]));
    levels.forEach((level, i) => expect(level - (levels[i - 1] ?? 0)).toBeLessThanOrEqual(1));
  },
};
