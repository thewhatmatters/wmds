import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Breadcrumb } from "../components/molecules/Breadcrumb/Breadcrumb";

/** Links rule K6 (WCAG 2.5.8): standalone links are at least 24×24px. Run via `npm run test:interactions`. */
const meta = {
  title: "Internal/Interactions/Link targets",
  tags: ["test", "!dev", "!autodocs"],
  parameters: { docs: { disable: true }, wmdsLayout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BreadcrumbTargets: Story = {
  name: "breadcrumb links are at least 24px tall without moving the row",
  render: () => (
    <Breadcrumb
      items={[
        { label: "Home", href: "#home" },
        { label: "Blog", href: "#blog" },
        { label: "How we scope a brand sprint" },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    for (const name of ["Home", "Blog"]) {
      const box = canvas.getByRole("link", { name }).getBoundingClientRect();
      expect(box.height).toBeGreaterThanOrEqual(24);
      expect(box.width).toBeGreaterThanOrEqual(24);
    }
    // The current page sits on the same line as the links.
    const current = canvas.getByText("How we scope a brand sprint").getBoundingClientRect();
    const home = canvas.getByRole("link", { name: "Home" }).getBoundingClientRect();
    expect(Math.abs(current.top + current.height / 2 - (home.top + home.height / 2))).toBeLessThanOrEqual(1);
  },
};
