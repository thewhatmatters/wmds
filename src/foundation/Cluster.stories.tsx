import type { Meta, StoryObj } from "@storybook/react-vite";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../components/atoms/Button/Button";
import { IconButton } from "../components/atoms/IconButton/IconButton";
import {
  clusterComponentSizeMap,
  clusterHeightPx,
  clusterTiers,
  iconButtonSizeForCluster,
} from "../lib/clusterScale";
import { Chip } from "../components/molecules/Chip/Chip";

const meta = {
  title: "Foundation/Cluster",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Cluster control scale (ADR-0011)

Shared heights for controls in **one row** — Card headers, filter rails, toolbar groups.

| Cluster | Token | Height |
|---------|-------|--------|
| **sm** | \`--cluster-height-sm\` | 28px |
| **md** | \`--cluster-height-md\` | 36px |
| **lg** | \`--cluster-height-lg\` | 44px |

### Canonical pairing

| Cluster | Chip | IconButton | Button |
|---------|------|------------|--------|
| **sm** | \`sm\` | \`xs\` | \`xs\` |
| **md** | \`md\` | \`sm\` | \`sm\` |
| **lg** | \`lg\` | \`md\` | \`md\` |

Component \`size\` prop names differ — use the **cluster tier** as the source of truth. Helpers: \`iconButtonSizeForCluster()\`, \`buttonSizeForCluster()\` in \`clusterScale.ts\`.

**Outside cluster:** IconButton \`lg\` (FAB), Button \`lg\`, IconButton \`inset\` (chip dismiss), Search inner track.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PairingTable: Story = {
  name: "Reference — pairing table",
  render: () => (
    <table className="w-full max-w-lg border-collapse text-left text-sm text-fg">
      <thead>
        <tr className="border-b border-border">
          <th className="py-2 pr-4 font-medium">Cluster</th>
          <th className="py-2 pr-4 font-medium">Height</th>
          <th className="py-2 pr-4 font-medium">Chip</th>
          <th className="py-2 pr-4 font-medium">IconButton</th>
          <th className="py-2 pr-4 font-medium">Button</th>
        </tr>
      </thead>
      <tbody>
        {clusterTiers.map((tier) => (
          <tr key={tier} className="border-b border-border">
            <td className="py-2 pr-4 font-mono">{tier}</td>
            <td className="py-2 pr-4 tabular-nums">{clusterHeightPx[tier]}px</td>
            <td className="py-2 pr-4 font-mono">{clusterComponentSizeMap.chip[tier]}</td>
            <td className="py-2 pr-4 font-mono">{clusterComponentSizeMap.iconButton[tier]}</td>
            <td className="py-2 pr-4 font-mono">{clusterComponentSizeMap.button[tier]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const ClusterSm: Story = {
  name: "Specimen — cluster sm (28px)",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip size="sm" selected>
        Overview
      </Chip>
      <Chip size="sm">Hours</Chip>
      <IconButton
        size={iconButtonSizeForCluster("sm")}
        role="ghost"
        icon={<EllipsisVertical strokeWidth={2} />}
        aria-label="More actions"
        title="More"
      />
      <Button size="xs" role="secondary">
        Action
      </Button>
    </div>
  ),
};

export const ClusterMd: Story = {
  name: "Specimen — cluster md (36px)",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip size="md" selected>
        Overview
      </Chip>
      <Chip size="md">Hours</Chip>
      <IconButton
        size={iconButtonSizeForCluster("md")}
        role="ghost"
        icon={<EllipsisVertical strokeWidth={2} />}
        aria-label="More actions"
        title="More"
      />
      <Button size="sm" role="secondary">
        Action
      </Button>
    </div>
  ),
};

export const ClusterLg: Story = {
  name: "Specimen — cluster lg (44px)",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip size="lg" selected>
        Overview
      </Chip>
      <Chip size="lg">Hours</Chip>
      <IconButton
        size={iconButtonSizeForCluster("lg")}
        role="ghost"
        icon={<EllipsisVertical strokeWidth={2} />}
        aria-label="More actions"
        title="More"
      />
      <Button size="md" role="secondary">
        Action
      </Button>
    </div>
  ),
};
