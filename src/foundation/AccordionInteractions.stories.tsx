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

const longQuestion = "Do you build the menu page from our PDF, or do we have to type it all out again?";

/** The vertical centre of the first line of an element's text. */
function firstLineCentre(element: HTMLElement): number {
  const range = document.createRange();
  range.selectNodeContents(element);
  const first = range.getClientRects()[0];
  return first.top + first.height / 2;
}

function centre(element: Element): number {
  const box = element.getBoundingClientRect();
  return box.top + box.height / 2;
}

export const LongLabelWraps: Story = {
  name: "a long plain label wraps; one-line rows stay 44px",
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      <Accordion variant="plain" flush size="reading">
        <Accordion.Item leading={<span data-testid="number">02</span>} label={longQuestion}>
          <p>We build it from your PDF.</p>
        </Accordion.Item>
        <Accordion.Item leading={<span>03</span>} label="Who owns the site?">
          <p>You do.</p>
        </Accordion.Item>
        <Accordion.Item label={<span className="type-heading-3">A title in its own type</span>}>
          <p>Still one 44px row.</p>
        </Accordion.Item>
      </Accordion>
      <Accordion variant="plain">
        <Accordion.Item label={`Body size: ${longQuestion}`}>
          <p>Wraps at 14px too.</p>
        </Accordion.Item>
        <Accordion.Item label="How long?">
          <p>About two weeks.</p>
        </Accordion.Item>
      </Accordion>
      <Accordion variant="list">
        <Accordion.Item label={`List rows keep one line: ${longQuestion}`}>
          <p>App rows truncate.</p>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
  play: async ({ canvas }) => {
    const long = canvas.getByRole("button", { name: `02 ${longQuestion}` });
    const label = canvas.getByText(longQuestion);

    // The whole question shows: more than one line, nothing cut off, and the row grows with it.
    await expect(getComputedStyle(label).textOverflow).not.toBe("ellipsis");
    await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
    await expect(long.offsetHeight).toBeGreaterThan(44 + 20);

    // The number and the chevron stay beside the first line (within 2px of its centre).
    const line = firstLineCentre(label);
    await expect(Math.abs(centre(canvas.getByTestId("number")) - line)).toBeLessThanOrEqual(2);
    const chevron = long.querySelector("svg");
    if (chevron == null) throw new Error("Accordion trigger has no chevron.");
    await expect(Math.abs(centre(chevron) - line)).toBeLessThanOrEqual(2);

    // size="reading": the question is set at the answer's 17px step.
    await expect(getComputedStyle(label).fontSize).toBe("17px");

    // One-line rows keep the 44px touch height, in WMDS's type and in a title that brings its own.
    await expect(canvas.getByRole("button", { name: "03 Who owns the site?" }).offsetHeight).toBe(44);
    await expect(canvas.getByRole("button", { name: "A title in its own type" }).offsetHeight).toBe(44);
    await expect(canvas.getByRole("button", { name: "How long?" }).offsetHeight).toBe(44);

    // The body-size plain label (14px) wraps as well.
    const body = canvas.getByRole("button", { name: `Body size: ${longQuestion}` });
    await expect(body.offsetHeight).toBeGreaterThan(44 + 16);

    // List rows are app rows: one line, 44px, truncated.
    const list = canvas.getByRole("button", { name: `List rows keep one line: ${longQuestion}` });
    await expect(list.offsetHeight).toBe(44);
    await expect(getComputedStyle(canvas.getByText(`List rows keep one line: ${longQuestion}`)).textOverflow).toBe("ellipsis");
  },
};
