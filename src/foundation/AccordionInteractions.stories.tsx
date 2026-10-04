import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { Checkbox } from "../components/atoms/Checkbox/Checkbox";
import { Accordion } from "../components/molecules/Accordion/Accordion";

/**
 * Browser interaction tests for **Accordion** — run via `npm run test:interactions`.
 * A closed panel turns `visibility: hidden` once its fold ends, so Tab skips its controls.
 */
const meta = {
  title: "Internal/Interactions/Accordion",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function panelOf(trigger: HTMLElement): HTMLElement {
  const id = trigger.getAttribute("aria-controls");
  const panel = id != null ? document.getElementById(id) : null;
  if (panel == null) throw new Error("Accordion trigger has no panel.");
  return panel;
}

async function waitForPanel(trigger: HTMLElement, visibility: "visible" | "hidden") {
  await waitFor(
    () => {
      const collapse = panelOf(trigger).parentElement;
      if (collapse == null) throw new Error("Accordion panel has no collapse wrapper.");
      const style = getComputedStyle(collapse);
      expect(style.visibility).toBe(visibility);
      expect(style.opacity).toBe(visibility === "visible" ? "1" : "0");
    },
    { timeout: 2000 },
  );
}

export const TabSkipsClosedPanels: Story = {
  name: "Tab skips a closed panel's controls",
  render: () => (
    <div className="w-80">
      <Accordion variant="list">
        <Accordion.Item label="Topic">
          <div className="flex flex-col gap-2">
            <Checkbox label="Guides" />
            <Checkbox label="Notes" />
          </div>
        </Accordion.Item>
        <Accordion.Item label="Year">
          <Checkbox label="2026" />
        </Accordion.Item>
      </Accordion>
    </div>
  ),
  play: async ({ canvas }) => {
    const topic = canvas.getByRole("button", { name: "Topic" });
    const year = canvas.getByRole("button", { name: "Year" });

    // Closed from the start: Tab goes trigger to trigger, and the panel's controls are not exposed.
    await waitForPanel(topic, "hidden");
    await expect(canvas.queryByRole("checkbox", { name: "Guides" })).toBeNull();
    topic.focus();
    await userEvent.tab();
    await expect(year).toHaveFocus();

    // Open: Tab reaches the panel's first control.
    await userEvent.click(topic);
    await waitForPanel(topic, "visible");
    topic.focus();
    await userEvent.tab();
    await expect(canvas.getByRole("checkbox", { name: "Guides" })).toHaveFocus();

    // Closed again: once the fold ends, Tab skips the panel.
    await userEvent.click(topic);
    await expect(topic).toHaveAttribute("aria-expanded", "false");
    await waitForPanel(topic, "hidden");
    topic.focus();
    await userEvent.tab();
    await expect(year).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(topic).toHaveFocus();
  },
};
