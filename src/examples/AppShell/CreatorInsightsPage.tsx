import { Share2 } from "lucide-react";
import { Button } from "../../components/atoms/Button/Button";
import { PageHeader } from "../../components/molecules/PageHeader/PageHeader";
import {
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantWellClasses,
  cardSubtitleClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Stat } from "../../components/molecules/Stat/Stat";
import { typographyClass } from "../../lib/typography";
import { appShellStatGroupClasses } from "./appShellStyles";

export interface CreatorInsightsPageProps {
  /** When false, omit the in-page section title — **AppHeader** owns the chrome. */
  showSectionTitle?: boolean;
}

export function CreatorInsightsPage({ showSectionTitle = false }: CreatorInsightsPageProps) {
  return (
    <>
      {showSectionTitle ? (
        <PageHeader
          variant="page"
          title="Insights"
          end={
            <Button role="secondary" size="sm" icon={<Share2 strokeWidth={2} />}>
              Share
            </Button>
          }
        />
      ) : null}

      <Stat.Group
        aria-label="Insights metrics"
        columns={4}
        className={appShellStatGroupClasses}
      >
        <Stat
          label="Followers"
          value="12,480"
          trend={{ value: "+2.1%", direction: "up", label: "vs last period" }}
        />
        <Stat label="ER" value="4.2%" trend={{ value: "+0.3%", direction: "up" }} />
        <Stat label="Reach" value="256K" trend={{ value: "-1.2%", direction: "down" }} />
        <Stat label="Saves" value="3,241" />
      </Stat.Group>

      <Card padding="none" bodyTerminal>
        <Card.Header
          start={<h2 className={cardTitleClasses}>Reach over time</h2>}
          end={<span className={cardSubtitleClasses}>Daily</span>}
        />
        <Card.Body>
          <div
            className={`${cardLayoutBodyOccupantInsetXClasses} ${cardLayoutBodyOccupantPadYClasses}`}
          >
            <div
              className={`${cardLayoutBodyOccupantWellClasses} flex min-h-[220px] items-center justify-center`}
            >
              <p className={`${typographyClass("caption")} text-muted`}>
                Chart.Cartesian area — compose in Card.Body
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
