import { useState } from "react";
import { Dog, MapPin, Tags, X } from "lucide-react";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import { Card, cardAddressClasses, cardTitleClasses } from "../../components/molecules/Card/Card";
import { Chip } from "../../components/molecules/Chip/Chip";
import { TaskRows } from "../../components/molecules/TaskRows/TaskRows";
import { cn } from "../../lib/cn";

/** Example-tier market record — app maps API / geo data into this shape. */
export interface FarmerMarketDetail {
  name: string;
  street: string;
  cityLine?: string;
  miles: number;
  snap?: boolean;
  openToday?: boolean;
  dogsAllowed?: boolean;
}

export interface MarketDetailCardProps {
  market: FarmerMarketDetail;
  /** Map overlay dismiss — app-owned; omit in static Storybook specimens. */
  onClose?: () => void;
  className?: string;
}

/**
 * FM map overlay content — mount inside the map library’s overlay slot.
 * Pattern: **Molecules/TaskRows → Pattern — FM market detail**.
 */
export function MarketDetailCard({ market, onClose, className }: MarketDetailCardProps) {
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const serviceChips = [
    market.snap ? (
      <Chip key="snap" readOnly size="sm">
        SNAP / EBT
      </Chip>
    ) : null,
    market.dogsAllowed ? (
      <Chip key="dogs" readOnly size="sm" icon={<Dog strokeWidth={2} />}>
        Dogs welcome
      </Chip>
    ) : null,
    market.openToday ? (
      <Chip key="open" readOnly size="sm">
        Open today
      </Chip>
    ) : null,
  ].filter(Boolean);

  const serviceCount = serviceChips.length;

  return (
    <div className={cn("w-max max-w-full", className)}>
      <Card padding="none">
        <Card.Header
          start={
            <>
              <h2 className={cardTitleClasses}>{market.name}</h2>
              <div className={cardAddressClasses}>
                <span>{market.street}</span>
                {market.cityLine ? <span>{market.cityLine}</span> : null}
              </div>
            </>
          }
          end={
            <IconButton
              icon={<X strokeWidth={2} />}
              aria-label="Close market detail"
              title="Close market detail"
              role="secondary"
              size="sm"
              onClick={onClose}
            />
          }
        />
        <Card.Body>
          <TaskRows variant="capsule">
            <TaskRows.Item
              icon={<MapPin strokeWidth={2} />}
              label="Get directions"
              meta={`${market.miles} mi`}
              detailsLayout="actions"
              detailsLabel="Open in"
              open={directionsOpen}
              onOpenChange={setDirectionsOpen}
            >
              <TaskRows.Detail variant="button" label="Apple Maps" onPress={() => undefined} />
              <TaskRows.Detail variant="button" label="Google Maps" onPress={() => undefined} />
            </TaskRows.Item>
            {serviceCount > 0 ? (
              <TaskRows.Item
                icon={<Tags strokeWidth={2} />}
                label="Services offered"
                meta={String(serviceCount)}
                detailsLayout="chips"
                open={servicesOpen}
                onOpenChange={setServicesOpen}
              >
                {serviceChips}
              </TaskRows.Item>
            ) : null}
          </TaskRows>
        </Card.Body>
      </Card>
    </div>
  );
}
