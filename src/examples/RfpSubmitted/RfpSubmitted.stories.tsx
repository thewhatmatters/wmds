import { useEffect, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { ConfettiProvider } from "../../components/organisms/Confetti/Confetti";
import { GridOverlay } from "../../lib/GridOverlay";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../lib/storyCopySource";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";
import { RfpFlow, rfpSubmittedCopySource } from "./RfpSubmittedExample";

const meta = {
  title: "Examples/RFP submitted",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Request-for-proposal form. **ConfettiProvider** wraps the page. A successful submit leaves the form and mounts a confirmation view. That view calls \`useConfettiOnMount()\` once, from the top-center of the viewport, with a wide spread so the burst rains over the page.

## Anatomy

\`\`\`
ConfettiProvider
└── grid-page
    ├── Card — request form (company, email, project, budget, brief, submit)
    └── Card — confirmation (success heading, summary, next steps, back)
\`\`\`

\`fire()\` does nothing when reduced motion is on, including the mount helper. Show code is the page without Storybook grid controls.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function RfpSubmittedCanvas() {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(1280);
  const [columnGap, setColumnGap] = useState(24);

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    return () => {
      if (previousTheme == null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
    };
  }, [theme]);

  return (
    <ConfettiProvider>
      <main
        className="grid-page min-h-dvh bg-body"
        style={
          {
            "--grid-max": `${gridMax}px`,
            "--grid-column-gap": `${columnGap}px`,
          } as CSSProperties
        }
      >
        <GridOverlay visible={gridVisible} onVisibleChange={setGridVisible} keyboardShortcut={false} />
        <RfpFlow />
        <ExampleGridControls
          gridVisible={gridVisible}
          onGridVisibleChange={setGridVisible}
          theme={theme}
          onThemeChange={setTheme}
          maxWidth={gridMax}
          onMaxWidthChange={setGridMax}
          columnGap={columnGap}
          onColumnGapChange={setColumnGap}
          defaultMaxWidth={1280}
          defaultColumnGap={24}
        />
      </main>
    </ConfettiProvider>
  );
}

export const RfpSubmitted: Story = {
  name: "Pattern — RFP submitted",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Submit the request. The form moves to a confirmation view, and confetti fires once from the top-center of the viewport. Reduced motion skips the burst. Grid controls are Storybook-only; Show code freezes `--grid-max: 80rem` and `--grid-column-gap: 24px`.",
        },
      },
    },
    rfpSubmittedCopySource,
  ),
  render: () => <RfpSubmittedCanvas />,
};
