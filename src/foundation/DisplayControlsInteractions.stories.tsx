import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import {
  DisplayControls,
  type DisplayControlThemeMode,
} from "../components/molecules/DisplayControls/DisplayControls";

const meta = {
  title: "Foundation/Display controls interactions",
  tags: ["test", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointerAndKeyboard: Story = {
  name: "DisplayControls — pointer and keyboard",
  render: function DisplayControlsInteractionExample() {
    const [gridVisible, setGridVisible] = useState(false);
    const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");

    return (
      <div>
        <p data-testid="display-state">
          Grid: {gridVisible ? "on" : "off"} · Theme: {theme}
        </p>
        <DisplayControls
          gridVisible={gridVisible}
          onGridVisibleChange={setGridVisible}
          theme={theme}
          onThemeChange={setTheme}
        />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const gridButton = canvas.getByRole("button", { name: "Show grid" });
    await userEvent.click(gridButton);
    await expect(canvas.getByTestId("display-state")).toHaveTextContent("Grid: on");
    await expect(canvas.getByRole("button", { name: "Hide grid" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await userEvent.keyboard("g");
    await expect(canvas.getByTestId("display-state")).toHaveTextContent("Grid: off");

    await userEvent.keyboard("t");
    await expect(canvas.getByTestId("display-state")).toHaveTextContent("Theme: light");
    await userEvent.keyboard("t");
    await expect(canvas.getByTestId("display-state")).toHaveTextContent("Theme: dark");
    await userEvent.keyboard("t");
    await expect(canvas.getByTestId("display-state")).toHaveTextContent("Theme: auto");
  },
};
