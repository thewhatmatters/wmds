import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Combobox, type ComboboxOption } from "../components/molecules/Combobox/Combobox";
import { Select } from "../components/molecules/Select/Select";

/**
 * Browser interaction tests for **Combobox** — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Combobox",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const fonts: ComboboxOption[] = ["Inter", "Inter Tight", "Lato", "Manrope", "Open Sans", "Roboto", "Roboto Mono", "Work Sans"].map(
  (label) => ({ value: label, label }),
);

const manyFonts: ComboboxOption[] = Array.from({ length: 1800 }, (_, index) => ({
  value: `font-${index}`,
  label: `Family ${String(index).padStart(4, "0")}`,
}));

function FontPicker({ options = fonts }: { options?: ComboboxOption[] }) {
  const [family, setFamily] = useState("Inter");
  const [weight, setWeight] = useState("400");
  return (
    <div className="flex w-80 flex-col gap-4">
      <Combobox label="Headings font" options={options} value={family} onValueChange={setFamily} emptyText="No fonts match" />
      <Select
        label="Weight"
        options={["400", "600", "700"].map((value) => ({ value, label: value }))}
        value={weight}
        onValueChange={setWeight}
      />
      <p data-testid="picked">{`${family} ${weight}`}</p>
    </div>
  );
}

export const KeyboardPath: Story = {
  name: "typing narrows, arrows move, Enter picks, focus stays in the field",
  render: () => <FontPicker />,
  play: async ({ canvas }) => {
    const field = canvas.getByRole("combobox", { name: "Headings font" });
    expect(field).toHaveValue("Inter");
    expect(field).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(field);
    await userEvent.clear(field);
    await userEvent.type(field, "rob");
    const list = await waitFor(() => within(document.body).getByRole("listbox", { name: "Headings font" }));
    expect(field).toHaveAttribute("aria-expanded", "true");
    expect(field).toHaveAttribute("aria-controls", list.id);
    expect(within(list).getAllByRole("option").map((option) => option.textContent)).toEqual(["Roboto", "Roboto Mono"]);

    // The first result is active; ↓ moves to the next, and the field names it.
    await userEvent.keyboard("{ArrowDown}");
    const mono = within(list).getByRole("option", { name: "Roboto Mono" });
    expect(field).toHaveAttribute("aria-activedescendant", mono.id);
    expect(field).toHaveFocus();

    // Space types a space; it doesn't pick.
    await userEvent.keyboard(" ");
    expect(field).toHaveValue("rob ");
    await userEvent.keyboard("{Backspace}{ArrowDown}{Enter}");
    expect(field).toHaveValue("Roboto Mono");
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(field).toHaveFocus();
    // A family pick leaves the weight alone.
    expect(canvas.getByTestId("picked")).toHaveTextContent("Roboto Mono 400");
  },
};

export const EmptyAndEscape: Story = {
  name: "no match says so; Escape closes, a second Escape clears, leaving restores the pick",
  render: () => <FontPicker />,
  play: async ({ canvas }) => {
    const field = canvas.getByRole("combobox", { name: "Headings font" });
    await userEvent.click(field);
    await userEvent.clear(field);
    await userEvent.type(field, "zzz");
    await waitFor(() => expect(within(document.body).getByText("No fonts match", { selector: "p" })).toBeVisible());
    expect(within(document.body).queryByRole("listbox")).toBeNull();
    expect(field).not.toHaveAttribute("aria-activedescendant");
    const status = canvas.getByRole("status");
    expect(status).toHaveTextContent("No fonts match");
    expect(field.getAttribute("aria-describedby")).toContain(status.id);

    await userEvent.keyboard("{Escape}");
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(field).toHaveValue("zzz");
    await userEvent.keyboard("{Escape}");
    expect(field).toHaveValue("");

    // Typed text that matches nothing isn't a value: leaving puts the pick back.
    await userEvent.type(field, "zz");
    await userEvent.tab();
    expect(field).toHaveValue("Inter");
    expect(canvas.getByTestId("picked")).toHaveTextContent("Inter 400");
  },
};

export const PointerPick: Story = {
  name: "a click on a row picks it",
  render: () => <FontPicker />,
  play: async ({ canvas }) => {
    const field = canvas.getByRole("combobox", { name: "Headings font" });
    await userEvent.click(field);
    const list = await waitFor(() => within(document.body).getByRole("listbox"));
    // Opening shows the whole list with the current pick marked.
    expect(within(list).getAllByRole("option")).toHaveLength(fonts.length);
    expect(within(list).getByRole("option", { name: "Inter" })).toHaveAttribute("aria-selected", "true");
    await userEvent.click(within(list).getByRole("option", { name: "Lato" }));
    expect(field).toHaveValue("Lato");
    expect(field).toHaveFocus();
    expect(canvas.getByTestId("picked")).toHaveTextContent("Lato 400");
  },
};

export const LongList: Story = {
  name: "1,800 options render 50 rows and say how many more",
  render: () => <FontPicker options={manyFonts} />,
  play: async ({ canvas }) => {
    const field = canvas.getByRole("combobox", { name: "Headings font" });
    await userEvent.click(field);
    const list = await waitFor(() => within(document.body).getByRole("listbox"));
    expect(within(list).getAllByRole("option")).toHaveLength(50);
    expect(canvas.getByRole("status")).toHaveTextContent("1,800 results, first 50 shown");
    expect(within(document.body).getByText("1,750 more. Keep typing to narrow.")).toBeVisible();

    await userEvent.clear(field);
    await userEvent.type(field, "1799");
    await waitFor(() => expect(within(list).getAllByRole("option").map((option) => option.textContent)).toEqual(["Family 1799"]));
    await userEvent.keyboard("{Enter}");
    expect(field).toHaveValue("Family 1799");
  },
};
