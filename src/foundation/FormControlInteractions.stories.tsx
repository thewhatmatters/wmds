import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Checkbox } from "../components/atoms/Checkbox/Checkbox";
import { Switch } from "../components/atoms/Switch/Switch";
import { CheckboxGroup } from "../components/molecules/CheckboxGroup/CheckboxGroup";
import { RadioGroup } from "../components/molecules/RadioGroup/RadioGroup";
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
