import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Badge } from "../../components/atoms/Badge/Badge";
import {
  Card,
  cardSubtitleClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { PageHeader } from "../../components/molecules/PageHeader/PageHeader";
import { Chart } from "../../components/organisms/Chart/Chart";
import { GridOverlay } from "../../lib/GridOverlay";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";
import {
  activityCells,
  activityColumns,
  activityRows,
  creatorComposition,
  creatorCompositionConfig,
  recentPostReach,
} from "./chartExplorationsData";
import {
  chartExplorationsBodyClasses,
  chartExplorationsCardClasses,
  chartExplorationsContentBandClasses,
  chartExplorationsContentClasses,
  chartExplorationsContractClasses,
  chartExplorationsContractCopyClasses,
  chartExplorationsGalleryClasses,
  chartExplorationsHeaderClasses,
  chartExplorationsHeaderCopyClasses,
  chartExplorationsPageClasses,
  chartExplorationsWellClasses,
} from "./chartExplorationsStyles";

interface ExplorationCardProps {
  title: string;
  description: string;
  source: "Graph data" | "Illustrative";
  contract: string;
  children: ReactNode;
}

function ExplorationCard({
  title,
  description,
  source,
  contract,
  children,
}: ExplorationCardProps) {
  return (
    <Card shape="rounded" className={chartExplorationsCardClasses}>
      <Card.Header
        start={
          <>
            <h2 className={cardTitleClasses}>{title}</h2>
            <p className={cardSubtitleClasses}>{description}</p>
          </>
        }
        end={
          <Badge variant="neutral" emphasis="muted" size="sm">
            {source}
          </Badge>
        }
      />
      <Card.Body className={chartExplorationsBodyClasses}>
        <div className={chartExplorationsWellClasses}>{children}</div>
      </Card.Body>
      <Card.Footer>
        <div className={chartExplorationsContractClasses}>
          <Badge variant="neutral" emphasis="muted" size="sm">
            Data shape
          </Badge>
          <p className={chartExplorationsContractCopyClasses}>{contract}</p>
        </div>
      </Card.Footer>
    </Card>
  );
}

export function ChartExplorationsExample() {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(1140);
  const [columnGap, setColumnGap] = useState(8);
  const pageStyle = useMemo(
    () =>
      ({
        "--grid-max": `${gridMax}px`,
        "--grid-column-gap": `${columnGap}px`,
      }) as CSSProperties,
    [columnGap, gridMax],
  );

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
    <main
      data-theme={theme === "auto" ? undefined : theme}
      className={chartExplorationsPageClasses}
      style={pageStyle}
    >
      <GridOverlay
        visible={gridVisible}
        onVisibleChange={setGridVisible}
        keyboardShortcut={false}
      />

      <div className={chartExplorationsContentBandClasses}>
        <div className={chartExplorationsContentClasses}>
          <section className={chartExplorationsHeaderClasses}>
            <PageHeader variant="page" title="Chart explorations" />
            <p className={chartExplorationsHeaderCopyClasses}>
              Three data contracts compared on the WMDS subgrid. PitchKit remains
              unchanged until one earns a place in the product.
            </p>
          </section>

          <div className={chartExplorationsGalleryClasses}>
            <ExplorationCard
              title="100-unit composition"
              description="Exact part-to-whole audience composition."
              source="Graph data"
              contract="parts: Array<{ key, value }>; one shared denominator, normally 100."
            >
              <Chart.UnitGrid
                aria-label="Audience gender: 68% women, 30% men, 2% not specified"
                config={creatorCompositionConfig}
                parts={creatorComposition}
                minHeight={240}
              />
            </ExplorationCard>

            <ExplorationCard
              title="Reach distribution"
              description="Six independent post values against typical reach."
              source="Graph data"
              contract="items: Array<{ id, label, value }>; optional supplied reference value."
            >
              <Chart.DistributionStrip
                aria-label="Reach distribution for six recent posts"
                items={recentPostReach}
                metricLabel="Reach"
                reference={{ value: 9300, label: "Typical 9.3K" }}
                minHeight={240}
              />
            </ExplorationCard>

            <ExplorationCard
              title="Activity heatmap"
              description="Day × time intensity needs an additional matrix."
              source="Illustrative"
              contract="rows + columns + cells: Array<{ rowKey, columnKey, value }>; not currently supplied by PitchKit Graph data."
            >
              <Chart.Heatmap
                aria-label="Illustrative audience activity by day and time"
                rows={activityRows}
                columns={activityColumns}
                cells={activityCells}
                metricLabel="Activity"
                minHeight={240}
              />
            </ExplorationCard>
          </div>
        </div>
      </div>

      <ExampleGridControls
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
        maxWidth={gridMax}
        onMaxWidthChange={setGridMax}
        columnGap={columnGap}
        onColumnGapChange={setColumnGap}
        defaultMaxWidth={1140}
        defaultColumnGap={8}
      />
    </main>
  );
}
