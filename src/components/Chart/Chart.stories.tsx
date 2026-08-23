import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../Card/Card";
import { Chart } from "./Chart";

const equityCurve = [
  { date: "Mon", value: 102_400 },
  { date: "Tue", value: 102_180 },
  { date: "Wed", value: 103_050 },
  { date: "Thu", value: 102_920 },
  { date: "Fri", value: 104_210 },
  { date: "Sat", value: 104_680 },
  { date: "Sun", value: 105_120 },
];

const sparkUp = [48.2, 48.5, 48.1, 48.9, 49.2, 49.0, 49.8, 50.1];
const sparkDown = [50.1, 49.8, 50.2, 49.5, 49.1, 48.8, 48.4, 48.0];

const meta = {
  title: "Components/Chart",
  component: Chart.Area,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Token-themed Recharts wrappers — **`Chart.Area`** for hero/compact series, **`Chart.Sparkline`** for inline windows. " +
          "Install **`recharts`** in consumer apps. Theme helpers (`chartTheme`, `resolveChartTone`) ship from the same module.",
      },
    },
  },
} satisfies Meta<typeof Chart.Area>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroArea: Story = {
  name: "Area · hero",
  args: {
    data: equityCurve,
    dataKey: "value",
    xKey: "date",
    variant: "hero",
    tone: "auto",
    label: "Value",
    height: 300,
    formatValue: (value) =>
      value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
  },
};

export const CompactArea: Story = {
  name: "Area · compact",
  args: {
    data: equityCurve,
    dataKey: "value",
    xKey: "date",
    variant: "compact",
    tone: "primary",
    height: 120,
  },
};

export const Sparklines: Story = {
  name: "Sparkline",
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Chart.Sparkline values={sparkUp} tone="auto" />
        <span className="text-sm text-muted">Window closed up → success tone</span>
      </div>
      <div className="flex items-center gap-3">
        <Chart.Sparkline values={sparkDown} tone="auto" />
        <span className="text-sm text-muted">Window closed down → destructive tone</span>
      </div>
    </div>
  ),
};

export const InPortfolioCard: Story = {
  name: "In Card (portfolio)",
  render: () => (
    <Card variant="outlined" elevation="raised" padding="none" className="max-w-md">
      <div className="flex flex-col gap-2 px-3 pt-3">
        <div className="text-[13px] font-semibold text-fg">Portfolio value</div>
        <div className="text-3xl font-bold tracking-tight text-fg">$105,120</div>
        <div className="text-xs font-medium text-success">+ $2,720</div>
        <Chart.Area
          data={equityCurve}
          dataKey="value"
          xKey="date"
          variant="hero"
          tone="auto"
          label="Value"
          height={220}
          formatValue={(value) =>
            value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })
          }
        />
      </div>
    </Card>
  ),
};

export const Empty: Story = {
  name: "Empty state",
  args: {
    data: [{ date: "Mon", value: 100 }],
    dataKey: "value",
    xKey: "date",
    height: 120,
  },
};
