import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantWellClasses,
  cardTitleClasses,
} from "../components/molecules/Card/Card";
import { storyMetaDocsDefaults } from "../lib/storyCopySource";
import { typographyClass } from "../lib/typography";

const meta = {
  title: "Foundation/Shape",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
WMDS shape tokens keep repeated component geometry consistent. Card uses a **16px** outer shell and a concentric **14px** body-occupant radius after its 2px gutter.

- \`--radius-card-shell: 16px\`
- \`--radius-card-body: 14px\`

Component recipes consume these variables; experiences should not repeat raw radius values.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardConcentricRadii: Story = {
  name: "Reference — Card concentric radii",
  render: () => (
    <Card shape="rounded" bodyTerminal className="max-w-lg">
      <Card.Header
        start={<h2 className={cardTitleClasses}>Card shell · 16px</h2>}
      />
      <Card.Body>
        <div
          className={`flex min-h-48 items-center justify-center ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}
        >
          <p className={`${typographyClass("body")} text-muted`}>
            Body occupant · 14px
          </p>
        </div>
      </Card.Body>
    </Card>
  ),
};
