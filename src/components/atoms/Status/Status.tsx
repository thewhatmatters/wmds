import { cn } from "../../../lib/cn";
import {
  statusDotBaseClasses,
  statusDotPulseClass,
  statusDotToneClasses,
  type StatusTone,
} from "./statusDotStyles";
import {
  statusRingArcClasses,
  statusRingArcVisibleRatio,
  statusRingShellClasses,
  statusRingSizePx,
  statusRingStepClasses,
  statusRingStrokePx,
  statusRingSvgActiveClasses,
  statusRingSvgClasses,
  statusRingTrackClasses,
} from "./statusRingStyles";

export const statusVariants = ["ring", "dot"] as const;

export type StatusVariant = (typeof statusVariants)[number];

export { statusTones, type StatusTone } from "./statusDotStyles";

/** Layout-only — not for colors or size overrides. */
export type StatusLayoutClassName = string;

type StatusBesideLabelProps =
  | {
      /** Visible text beside the indicator exposes meaning — indicator is aria-hidden. */
      besideLabel: true;
      /** Optional — devtools only when adjacent text is the accessible name. */
      label?: string;
    }
  | {
      /** Indicator stands alone — `label` is required for screen readers and tooltip. */
      besideLabel?: false;
      label: string;
    };

export type StatusRingVariantProps = StatusBesideLabelProps & {
  variant: "ring";
  /** Spinning arc — **running** task step. Omit or false for **pending**. */
  active?: boolean;
  /** Step number centered in the ring. */
  step?: number;
  className?: StatusLayoutClassName;
};

export type StatusDotVariantProps = StatusBesideLabelProps & {
  variant: "dot";
  /** Semantic dot color — required for `variant="dot"`. */
  tone: StatusTone;
  /** Pulse for live, processing, or urgent attention. Respects `prefers-reduced-motion`. */
  pulsing?: boolean;
  className?: StatusLayoutClassName;
};

export type StatusProps = StatusRingVariantProps | StatusDotVariantProps;

function assertStatusBesideLabel(props: Pick<StatusProps, "besideLabel" | "label">) {
  if (!props.besideLabel && props.label == null) {
    console.warn("[WMDS Status] Provide `label` unless `besideLabel` is set.");
  }
}

function StatusRingPattern({
  active = false,
  step,
  label,
  besideLabel = false,
  className,
}: Omit<StatusRingVariantProps, "variant">) {
  assertStatusBesideLabel({ besideLabel, label });

  const size = statusRingSizePx;
  const stroke = statusRingStrokePx;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <span
      role={besideLabel ? undefined : "img"}
      aria-hidden={besideLabel ? true : undefined}
      aria-label={besideLabel ? undefined : label}
      title={besideLabel ? undefined : label}
      className={cn(statusRingShellClasses, className)}
      style={{ width: size, height: size }}
      data-variant="ring"
      data-pattern={besideLabel ? "beside-label" : "standalone"}
      data-active={active || undefined}
      data-step={step ?? undefined}
    >
      <svg
        width={size}
        height={size}
        className={cn(statusRingSvgClasses, active && statusRingSvgActiveClasses)}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={statusRingTrackClasses}
          strokeWidth={stroke}
        />
        {active ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={statusRingArcClasses}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference * statusRingArcVisibleRatio} ${circumference * (1 - statusRingArcVisibleRatio)}`}
          />
        ) : null}
      </svg>
      {step != null ? <span className={statusRingStepClasses}>{step}</span> : null}
    </span>
  );
}

function StatusDotPattern({
  tone,
  label,
  besideLabel = false,
  pulsing = false,
  className,
}: Omit<StatusDotVariantProps, "variant">) {
  assertStatusBesideLabel({ besideLabel, label });

  return (
    <span
      role={besideLabel ? undefined : "img"}
      aria-hidden={besideLabel ? true : undefined}
      aria-label={besideLabel ? undefined : label}
      title={besideLabel ? undefined : label}
      className={cn(
        statusDotBaseClasses,
        statusDotToneClasses[tone],
        pulsing && statusDotPulseClass,
        className,
      )}
      data-variant="dot"
      data-tone={tone}
      data-pattern={besideLabel ? "beside-label" : "standalone"}
      data-pulsing={pulsing || undefined}
    />
  );
}

/**
 * Fixed-scale status indicators — inspired by [Astryx StatusDot](https://astryx.atmeta.com/components/StatusDot).
 * Pattern-first: `variant="ring"` (24px task progress) or `variant="dot"` (8px semantic dot).
 */
export function Status(props: StatusProps) {
  if (props.variant === "ring") {
    const { variant: _variant, ...ringProps } = props;
    return <StatusRingPattern {...ringProps} />;
  }

  const { variant: _variant, ...dotProps } = props;
  return <StatusDotPattern {...dotProps} />;
}

export {
  statusRingArcVisibleRatio,
  statusRingSizePx,
  statusRingStrokePx,
} from "./statusRingStyles";
