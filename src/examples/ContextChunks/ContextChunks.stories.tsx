import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContextChunks } from "./ContextChunks";

const sampleChunks = [
  {
    id: "vendor-onboarding",
    title: "Vendor onboarding rule",
    characterCount: 290,
    body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
    fileName: "Dairy Onboarding SOP.pdf",
    fileKind: "pdf" as const,
  },
  {
    id: "seasonal-demand",
    title: "Seasonal demand row",
    characterCount: 1250,
    body: "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
    fileName: "Sales Velocity Export.csv",
    fileKind: "csv" as const,
  },
];

const meta = {
  title: "Examples/Context chunks",
  component: ContextChunks,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Design-system specimen — not a shipped component.** Recreates a RAG context-chunk list using `Card` (header/body section borders), `Badge` (`startSlot` / `endSlot` for file attachment rows), and Lucide icons. " +
          "Compose in product apps with exported primitives only.",
      },
    },
  },
} satisfies Meta<typeof ContextChunks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches reference layout — best viewed in Storybook dark theme toolbar. */
export const Default: Story = {
  args: {
    heading: "All chunks",
    totalCount: 32,
    chunks: sampleChunks,
  },
  decorators: [
    (Story) => (
      <div className="rounded-lg bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};
