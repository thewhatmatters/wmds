import { cn } from "../../../lib/cn";
import {
  statusDotBaseClasses,
  statusDotPulseClass,
  statusDotVariantClasses,
  type StatusDotVariant,
} from "./statusDotStyles";

export type { StatusDotVariant } from "./statusDotStyles";
export { statusDotVariants } from "./statusDotStyles";

/** Layout-only — not for colors or size overrides. */
export type StatusDotLayoutClassName = string;

type StatusDotPatternProps =
  | {
      /** Visible text beside the dot exposes the status name — dot is aria-hidden. */
      besideLabel: true;
      /** Optional — only for devtools; adjacent text is the accessible name. */
      label?: string;
    }
  | {
      /** Dot stands alone — `label` is required for screen readers and tooltip. */
      besideLabel?: false;
      label: string;
    };

export type StatusDotProps = StatusDotPatternProps & {
  variant: StatusDotVariant;
  /** Pulse for live, processing, or urgent attention. Respects `prefers-reduced-motion`. */
  pulsing?: boolean;
  /** Layout-only: margin in flex rows, table cells. */
  className?: StatusDotLayoutClassName;
};

function assertStatusDotPattern(props: Pick<StatusDotProps, "besideLabel" | "label">) {
  if (!props.besideLabel && props.label == null) {
    console.warn("[WMDS StatusDot] Provide `label` unless `besideLabel` is set.");
  }
}

/**
 * Small semantic status indicator — [Astryx StatusDot](https://astryx.atmeta.com/components/StatusDot).
 * Pattern-first: standalone (`label`) or beside visible text (`besideLabel`).
 */
export function StatusDot({
  variant,
  label,
  besideLabel = false,
  pulsing = false,
  className,
}: StatusDotProps) {
  assertStatusDotPattern({ besideLabel, label });

  return (
    <span
      role={besideLabel ? undefined : "img"}
      aria-hidden={besideLabel ? true : undefined}
      aria-label={besideLabel ? undefined : label}
      title={besideLabel ? undefined : label}
      className={cn(
        statusDotBaseClasses,
        statusDotVariantClasses[variant],
        pulsing && statusDotPulseClass,
        className,
      )}
      data-variant={variant}
      data-pattern={besideLabel ? "beside-label" : "standalone"}
      data-pulsing={pulsing || undefined}
    />
  );
}
