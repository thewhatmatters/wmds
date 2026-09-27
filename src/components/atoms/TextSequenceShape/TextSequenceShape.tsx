import { useId, type ReactNode, type SVGProps } from "react";
import { cn } from "../../../lib/cn";
import {
  textSequenceShapeBaseClasses,
  textSequenceShapeGraphicBaseClasses,
  textSequenceShapeGraphicClasses,
  textSequenceShapePaints,
  textSequenceShapeSizeClasses,
  textSequenceShapeTones,
  textSequenceShapeVariants,
  type TextSequenceShapeTone,
  type TextSequenceShapeVariant,
} from "./textSequenceShapeStyles";

export {
  textSequenceShapeTones,
  textSequenceShapeVariants,
  type TextSequenceShapeTone,
  type TextSequenceShapeVariant,
};

/** Layout only — margin. Not for recoloring or resizing. */
export type TextSequenceShapeLayoutClassName = string;

export interface TextSequenceShapeProps {
  variant: TextSequenceShapeVariant;
  /**
   * Token fill. Default `brand` (`--color-brand`).
   * `brand-soft` and `info-muted` paint a two-stop gradient between tokens.
   */
  tone?: TextSequenceShapeTone;
  /** Layout only. */
  className?: TextSequenceShapeLayoutClassName;
}

type MarkProps = {
  fill: string;
  gradient: ReactNode;
  className?: string;
};

type ShellProps = SVGProps<SVGSVGElement> & MarkProps & { children: ReactNode };

function Shell({ children, fill, gradient, className, ...props }: ShellProps) {
  return (
    <svg fill={fill} focusable="false" className={className} {...props}>
      {gradient}
      {children}
    </svg>
  );
}

function AsteriskMark(props: MarkProps) {
  return (
    <Shell {...props} viewBox="0 0 24 24">
      <path d="M11 1h2v6.2l5.2-3.6 1.1 1.7-5.4 3.2 5.4 3.2-1.1 1.7L13 12.8V21h-2v-8.2l-5.2 3.6-1.1-1.7 5.4-3.2L4.7 8.3l1.1-1.7L11 7.2V1Z" />
    </Shell>
  );
}

function PillMark(props: MarkProps) {
  return (
    <Shell {...props} viewBox="0 0 48 24">
      <path
        fillRule="evenodd"
        d="M12 2h24a10 10 0 0 1 0 20H12A10 10 0 0 1 12 2zM15.5 5.2h4.4v13.6h-4.4zM22 5.2h4.4v13.6H22zM28.5 5.2h4.4v13.6h-4.4z"
      />
    </Shell>
  );
}

function DiamondMark(props: MarkProps) {
  return (
    <Shell {...props} viewBox="0 0 24 24">
      <path d="M12 1.4 22.6 12 12 22.6 1.4 12 12 1.4Z" />
    </Shell>
  );
}

function DotsMark(props: MarkProps) {
  return (
    <Shell {...props} viewBox="0 0 16 28">
      <circle cx="8" cy="5.2" r="4.6" />
      <circle cx="8" cy="14" r="4.6" />
      <circle cx="8" cy="22.8" r="4.6" />
    </Shell>
  );
}

function DoublePillMark(props: MarkProps) {
  return (
    <Shell {...props} viewBox="0 0 48 24">
      <rect x="1.5" y="2" width="20" height="20" rx="10" />
      <rect x="26.5" y="2" width="20" height="20" rx="10" />
    </Shell>
  );
}

function CircleMark(props: MarkProps) {
  return (
    <Shell {...props} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
    </Shell>
  );
}

function SmileyMark({ fill, gradient, className }: MarkProps) {
  return (
    <Shell fill="none" gradient={gradient} className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9.2" stroke={fill} strokeWidth="2.4" />
      <circle cx="8.8" cy="10" r="1.45" fill={fill} />
      <circle cx="15.2" cy="10" r="1.45" fill={fill} />
      <path
        d="M8.2 14.2c1.15 2.15 6.45 2.15 7.6 0"
        stroke={fill}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Shell>
  );
}

const marks: Record<TextSequenceShapeVariant, (props: MarkProps) => ReactNode> = {
  asterisk: AsteriskMark,
  pill: PillMark,
  diamond: DiamondMark,
  dots: DotsMark,
  "double-pill": DoublePillMark,
  circle: CircleMark,
  smiley: SmileyMark,
};

function shapePaint(tone: TextSequenceShapeTone, gradientId: string): { fill: string; gradient: ReactNode } {
  const paint = textSequenceShapePaints[tone];
  if ("solid" in paint) {
    return { fill: paint.solid, gradient: null };
  }
  return {
    fill: `url(#${gradientId})`,
    gradient: (
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={paint.stops[0]} />
          <stop offset="1" stopColor={paint.stops[1]} />
        </linearGradient>
      </defs>
    ),
  };
}

/**
 * Inline decorative mark that wraps with the surrounding text.
 * Decorative — always `aria-hidden`. The sentence lives on TextSequence.
 * The layout gap is zero-height so the line box stays the type leading.
 */
export function TextSequenceShape({ variant, tone = "brand", className }: TextSequenceShapeProps) {
  const Glyph = marks[variant];
  const gradientId = `text-sequence-shape-${useId().replace(/:/g, "")}`;
  const paint = shapePaint(tone, gradientId);
  return (
    <span
      aria-hidden="true"
      data-text-sequence-shape=""
      data-variant={variant}
      className={cn(textSequenceShapeBaseClasses, textSequenceShapeSizeClasses[variant], className)}
    >
      <Glyph
        fill={paint.fill}
        gradient={paint.gradient}
        className={cn(textSequenceShapeGraphicBaseClasses, textSequenceShapeGraphicClasses[variant])}
      />
    </span>
  );
}
