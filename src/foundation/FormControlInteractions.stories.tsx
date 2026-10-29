import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { Badge } from "../components/atoms/Badge/Badge";
import { Checkbox } from "../components/atoms/Checkbox/Checkbox";
import { Input } from "../components/atoms/Input/Input";
import { Switch } from "../components/atoms/Switch/Switch";
import { TextArea } from "../components/atoms/TextArea/TextArea";
import { CheckboxGroup } from "../components/molecules/CheckboxGroup/CheckboxGroup";
import { Field } from "../components/molecules/Field/Field";
import { PromptBar } from "../components/molecules/PromptBar/PromptBar";
import { RadioGroup } from "../components/molecules/RadioGroup/RadioGroup";
import { Search } from "../components/molecules/Search/Search";
import { SegmentedControl } from "../components/molecules/SegmentedControl/SegmentedControl";

/**
 * Browser interaction tests for form controls — run via `npm run test:storybook`.
 * Tagged `test` so CI only executes these stories (not the full catalog).
 */
const meta = {
  title: "Internal/Interactions/Form controls",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SwitchToggle: Story = {
  name: "Switch — toggle",
  render: function SwitchToggleExample() {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        label="Enable notifications"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
  play: async ({ canvas }) => {
    const control = canvas.getByRole("switch", { name: /enable notifications/i });
    await expect(control).not.toBeChecked();
    await userEvent.click(control);
    await expect(control).toBeChecked();
    await userEvent.click(control);
    await expect(control).not.toBeChecked();
  },
};

export const CheckboxToggle: Story = {
  name: "Checkbox — toggle",
  render: function CheckboxToggleExample() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="Accept terms"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
  play: async ({ canvas }) => {
    const control = canvas.getByRole("checkbox", { name: /accept terms/i });
    await expect(control).not.toBeChecked();
    await userEvent.click(control);
    await expect(control).toBeChecked();
  },
};

export const CheckboxCount: Story = {
  name: "Checkbox — count is read after the label",
  render: function CheckboxCountExample() {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div className="flex w-64 flex-col gap-6">
        <CheckboxGroup label="Topic" size="sm" values={values} onValuesChange={setValues}>
          <CheckboxGroup.Item value="guides" label="Guides" count={2} />
          <CheckboxGroup.Item value="notes" label="Notes" count={1} countLabel="1 post" />
        </CheckboxGroup>
        <Checkbox label="Archive" description="Older posts." count={1200} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const guides = canvas.getByRole("checkbox", { name: "Guides (2)" });
    const notes = canvas.getByRole("checkbox", { name: "Notes (1 post)" });
    await userEvent.click(guides);
    await expect(guides).toBeChecked();
    await expect(notes).not.toBeChecked();

    // The visible count sits at the row's end, after the label.
    const row = guides.closest("label");
    if (row == null) throw new Error("Checkbox row is missing");
    const count = [...row.querySelectorAll<HTMLElement>("[aria-hidden]")].find((node) => node.textContent === "2");
    if (count == null) throw new Error("Visible count is missing");
    await expect(count.getBoundingClientRect().right).toBeCloseTo(row.getBoundingClientRect().right, 0);

    const archive = canvas.getByRole("checkbox", { name: /^Archive \(1,200\)/ });
    await expect(archive).toHaveAccessibleDescription("Older posts.");
  },
};

export const RadioGroupSelection: Story = {
  name: "RadioGroup — single select",
  render: function RadioGroupSelectionExample() {
    const [value, setValue] = useState("email");
    return (
      <RadioGroup label="Alert channel" value={value} onValueChange={setValue}>
        <RadioGroup.Item value="email" label="Email" />
        <RadioGroup.Item value="push" label="Push notifications" />
      </RadioGroup>
    );
  },
  play: async ({ canvas }) => {
    const email = canvas.getByRole("radio", { name: /^email$/i });
    const push = canvas.getByRole("radio", { name: /push notifications/i });

    await expect(email).toBeChecked();
    await expect(push).not.toBeChecked();

    await userEvent.click(push);

    await expect(push).toBeChecked();
    await expect(email).not.toBeChecked();
  },
};

export const CheckboxGroupMultiSelect: Story = {
  name: "CheckboxGroup — multi select",
  render: function CheckboxGroupMultiSelectExample() {
    const [values, setValues] = useState(["email"]);
    return (
      <CheckboxGroup label="Alert type" values={values} onValuesChange={setValues}>
        <CheckboxGroup.Item value="email" label="Email alerts" />
        <CheckboxGroup.Item value="push" label="Push notifications" />
      </CheckboxGroup>
    );
  },
  play: async ({ canvas }) => {
    const email = canvas.getByRole("checkbox", { name: /email alerts/i });
    const push = canvas.getByRole("checkbox", { name: /push notifications/i });

    await expect(email).toBeChecked();
    await expect(push).not.toBeChecked();

    await userEvent.click(push);
    await expect(push).toBeChecked();

    await userEvent.click(email);
    await expect(email).not.toBeChecked();
    await expect(push).toBeChecked();
  },
};

export const SegmentedControlSwitch: Story = {
  name: "SegmentedControl — segment switch",
  render: function SegmentedControlSwitchExample() {
    const [value, setValue] = useState("rounded");
    return (
      <SegmentedControl aria-label="Card shape" value={value} onValueChange={setValue} size="sm">
        <SegmentedControl.Item value="rounded">Rounded</SegmentedControl.Item>
        <SegmentedControl.Item value="pill">Pill</SegmentedControl.Item>
      </SegmentedControl>
    );
  },
  play: async ({ canvas }) => {
    const rounded = canvas.getByRole("radio", { name: /rounded/i });
    const pill = canvas.getByRole("radio", { name: /^pill$/i });

    await expect(rounded).toBeChecked();
    await expect(pill).not.toBeChecked();

    await userEvent.click(pill);

    await expect(pill).toBeChecked();
    await expect(rounded).not.toBeChecked();
  },
};

export const TextAreaSoloFocusRing: Story = {
  name: "TextArea — solo focus ring",
  render: () => <TextArea label="Project details" />,
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox", { name: /project details/i });
    const shell = field.parentElement as HTMLElement;

    await userEvent.tab();
    await expect(field).toHaveFocus();

    // The shell's ring is the only focus indicator — no browser outline on the field inside it.
    await expect(getComputedStyle(field).outlineStyle).toBe("none");
    await waitFor(() => expect(getComputedStyle(shell).boxShadow).not.toBe("none"));
  },
};

export const FieldDescription: Story = {
  name: "Field — description describes the control",
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <Field label="Email" description="We only use it to reply.">
        <Input type="email" aria-describedby="email-extra" />
      </Field>
      <span id="email-extra" hidden>
        Work address preferred.
      </span>
      <Field label="Team" orientation="horizontal" description="Shown on your profile.">
        <Input />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const email = canvas.getByRole("textbox", { name: "Email" });
    expect(email).toHaveAccessibleDescription("Work address preferred. We only use it to reply.");
    expect(canvas.getByRole("textbox", { name: "Team" })).toHaveAccessibleDescription("Shown on your profile.");
  },
};

const ringed = (element: Element) => getComputedStyle(element).boxShadow !== "none";

export const InputHintAboveWithError: Story = {
  name: "Input — the hint sits above the field and stays with an error (Labels F8)",
  render: () => (
    <div className="w-80">
      <Input
        label="Phone"
        type="tel"
        description="Include the area code."
        status="error"
        message="Enter a phone number with its area code."
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox", { name: "Phone" });
    const hint = canvas.getByText("Include the area code.");
    await expect(hint).toBeVisible();
    await expect(hint.compareDocumentPosition(field) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await expect(field).toHaveAccessibleDescription(/^Include the area code\. .*Enter a phone number with its area code\.$/);
  },
};

export const SearchFocusRings: Story = {
  name: "Search — the pill rings for the field, the button rings for itself (Labels F10)",
  render: () => (
    <div className="w-96">
      <Search label="Search the docs" actionLabel="Search" />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText("Search the docs");
    const button = canvas.getByRole("button", { name: "Search" });
    const shell = field.closest("div:has(> button)") as HTMLElement;

    await userEvent.tab();
    await expect(field).toHaveFocus();
    await waitFor(() => expect(ringed(shell)).toBe(true));

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(ringed(shell)).toBe(false));
    await waitFor(() => expect(ringed(button)).toBe(true));
  },
};

export const PromptBarFocusRings: Story = {
  name: "PromptBar — the send button shows its own focus ring (Labels F10)",
  render: () => (
    <div className="w-96">
      <PromptBar aria-label="Message" defaultValue="Hello" sendLabel="Send" />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox", { name: "Message" });
    const button = canvas.getByRole("button", { name: "Send" });

    await userEvent.tab();
    await expect(field).toHaveFocus();
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(ringed(button)).toBe(true));
  },
};

const longWebsite = "https://www.northwind-bakery-and-coffee-roasters.example/locations/east-austin";

export const InputEndBadgeRoomAndReadOut: Story = {
  name: "Input — the badge keeps its room, comes after the status icon, and is read with the field (Required and optional Q8)",
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => (
    <div className="flex w-[358px] flex-col gap-6">
      <Input label="Your website" type="url" defaultValue={longWebsite} endBadge={<Badge size="sm">Optional</Badge>} />
      <Input
        label="Your site"
        type="url"
        defaultValue="https://northwind.example"
        status="success"
        endBadge={<Badge size="sm">Optional</Badge>}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox", { name: "Your website" });
    await expect(field).toHaveAccessibleDescription("Optional");
    const badge = document.getElementById(`${field.id}-badge`) as HTMLElement;
    // The text box ends before the badge starts, so a long value never runs under it.
    const box = field.getBoundingClientRect();
    const textEnd = box.right - parseFloat(getComputedStyle(field).paddingRight);
    await expect(textEnd).toBeLessThanOrEqual(badge.getBoundingClientRect().left);

    const ticked = canvas.getByRole("textbox", { name: "Your site" });
    const tickedBadge = document.getElementById(`${ticked.id}-badge`) as HTMLElement;
    const icon = tickedBadge.previousElementSibling as HTMLElement;
    await expect(icon).not.toBeNull();
    await expect(icon.getBoundingClientRect().right).toBeLessThanOrEqual(tickedBadge.getBoundingClientRect().left);
    const iconLeft = icon.getBoundingClientRect().left;
    const ticketTextEnd = ticked.getBoundingClientRect().right - parseFloat(getComputedStyle(ticked).paddingRight);
    await expect(ticketTextEnd).toBeLessThanOrEqual(iconLeft);
  },
};
