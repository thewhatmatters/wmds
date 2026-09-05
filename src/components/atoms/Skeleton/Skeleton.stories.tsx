import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantWellClasses,
} from "../../molecules/Card/Card";
import { Skeleton, skeletonRadii } from "./Skeleton";

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    radius: { control: "select", options: [...skeletonRadii] },
    index: { control: "number" },
  },
  args: {
    width: 240,
    height: 16,
    radius: "container",
    index: 0,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Placeholder blocks for **skeleton screens** while layout mounts — geometry from [Astryx Skeleton](https://astryx.atmeta.com/components/Skeleton), shimmer sweep from [Motion skeleton shimmer](https://motion.dev/examples/react-skeleton-shimmer). Compose multiple **Skeleton** shapes to mirror the resolved UI (title, select, chart well, legend). Not a chart-specific API.

Set \`aria-busy="true"\` on the owning **Card** or page region. Individual shapes are \`aria-hidden\`. Shimmer respects **MotionConfig** \`reducedMotion="user"\` — static blocks when reduced motion is preferred.

## Best practices

- **Do** match skeleton geometry to the loaded component — same heights as **Chart.Cartesian** \`minHeight\`, **Select** \`sm\`, \`cardTitleClasses\`.
- **Do** stagger \`index\` (0, 1, 2…) so shimmer sweeps trail across rows.
- **Do** swap the skeleton region for **Chart.Loading** (spinner + copy) when a fetch is in flight but chrome is already resolved.
- **Don't** put skeleton state on chart marks (**Chart.SegmentedBar**) — skeleton is layout-level, not mark-level.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Radii: Story = {
  name: "Reference — radii",
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      {skeletonRadii.map((radius, index) => (
        <div key={radius} className="flex items-center gap-3">
          <span className="w-20 font-mono text-xs text-muted">{radius}</span>
          <Skeleton width={160} height={radius === "full" ? 32 : 20} radius={radius} index={index} />
        </div>
      ))}
    </div>
  ),
};

export const OccupancyHistoryCardSkeleton: Story = {
  name: "Example — occupancy history Card",
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton screen mirroring **Organisms/Chart → Pattern — occupancy history in Card** — use **Controls → Body state → skeleton** on that story, or compose **Skeleton** blocks as shown here.",
      },
    },
  },
  render: () => (
    <Card shape="rounded" bodyTerminal className="max-w-lg" aria-busy="true" aria-label="Loading occupancy history">
      <Card.Header
        start={<Skeleton width={148} height={18} radius="inner" index={0} />}
        end={<Skeleton width={144} height={28} radius="full" index={1} />}
      />
      <Card.Body>
        <div
          className={`flex flex-col gap-3 ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`}
        >
          <Skeleton width="100%" height={220} radius="element" index={2} />
          <div className="flex flex-wrap gap-4">
            <Skeleton width={112} height={12} radius="inner" index={3} />
            <Skeleton width={96} height={12} radius="inner" index={4} />
          </div>
        </div>
      </Card.Body>
    </Card>
  ),
};
