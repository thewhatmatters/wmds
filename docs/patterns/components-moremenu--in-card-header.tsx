// @whatmatters/wmds@0.2.0 · Pattern — Card header cluster
// Storybook: Components/MoreMenu → Pattern — Card header cluster (?path=/story/components-moremenu--in-card-header)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import {
  ButtonIcon,
  Card,
  cardTitleClasses,
  cardSubtitleClasses,
  MoreMenu,
  SegmentedControl,
} from "@whatmatters/wmds";

function MarketCardHeader() {
  const [view, setView] = useState("overview");

  return (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={
          <>
            <h2 className={cardTitleClasses}>Texas Farmers' Market at Mueller</h2>
            <p className={cardSubtitleClasses}>2006 Philomena St. · Austin, TX</p>
          </>
        }
        end={
          <>
            <SegmentedControl
              aria-label="Market detail view"
              size="sm"
              value={view}
              onValueChange={setView}
            >
              <SegmentedControl.Item value="overview">Overview</SegmentedControl.Item>
              <SegmentedControl.Item value="hours">Hours</SegmentedControl.Item>
            </SegmentedControl>
            <MoreMenu
              aria-label="More market actions"
              size="xs"
              items={[
                {
                  id: "export",
                  label: "Export",
                  start: (
                    <ButtonIcon size="sm">
                      <Download strokeWidth={2} />
                    </ButtonIcon>
                  ),
                },
                {
                  id: "share",
                  label: "Share",
                  start: (
                    <ButtonIcon size="sm">
                      <Share2 strokeWidth={2} />
                    </ButtonIcon>
                  ),
                },
              ]}
              onAction={(id) => console.log(id)}
            />
          </>
        }
      />
      <Card.Body>
        <p>Body follows selected view.</p>
      </Card.Body>
    </Card>
  );
}
