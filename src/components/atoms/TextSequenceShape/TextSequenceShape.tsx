import type { ReactNode, SVGProps } from "react";
import { cn } from "../../../lib/cn";
import {
  textSequenceShapeBaseClasses,
  textSequenceShapeSizeClasses,
  textSequenceShapeToneClasses,
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
  /** Token fill. Default `brand` (`--color-brand`). */
  tone?: TextSequenceShapeTone;
  /** Layout only. */
  className?: TextSequenceShapeLayoutClassName;
}

type MarkProps = SVGProps<SVGSVGElement>;

function Mark({ children, ...props }: MarkProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" focusable="false" {...props}>
      {children}
    </svg>
  );
}

function AsteriskMark() {
  return (
    <Mark>
      <path d="M11 1h2v6.2l5.2-3.6 1.1 1.7-5.4 3.2 5.4 3.2-1.1 1.7L13 12.8V21h-2v-8.2l-5.2 3.6-1.1-1.7 5.4-3.2L4.7 8.3l1.1-1.7L11 7.2V1Z" />
    </Mark>
  );
}

function PillMark() {
  return (
    <Mark>
      <path
        fillRule="evenodd"
        d="M7.2 6h9.6a6 6 0 0 1 0 12H7.2a6 6 0 0 1 0-12zM7.6 8.2h1.05v7.6H7.6zM10.7 8.2h1.05v7.6h-1.05zM13.8 8.2h1.05v7.6h-1.05zM16.9 8.2h1.05v7.6h-1.05z"
      />
    </Mark>
  );
}

function DiamondMark() {
  return (
    <Mark>
      <path d="M12 2.2 21.8 12 12 21.8 2.2 12 12 2.2Z" />
    </Mark>
  );
}

function DotsMark() {
  return (
    <Mark>
      <circle cx="12" cy="4.2" r="2.15" />
      <circle cx="12" cy="12" r="2.15" />
      <circle cx="12" cy="19.8" r="2.15" />
    </Mark>
  );
}

function DoublePillMark() {
  return (
    <Mark>
      <rect x="1" y="7" width="9.2" height="10" rx="5" />
      <rect x="13.8" y="7" width="9.2" height="10" rx="5" />
    </Mark>
  );
}

function CircleMark() {
  return (
    <Mark>
      <circle cx="12" cy="12" r="8.2" />
    </Mark>
  );
}

function SmileyMark() {
  return (
    <Mark fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.15" fill="currentColor" />
      <circle cx="15" cy="10" r="1.15" fill="currentColor" />
      <path
        d="M8.4 14.2c1.1 2 6.1 2 7.2 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Mark>
  );
}

const marks: Record<TextSequenceShapeVariant, () => ReactNode> = {
  asterisk: AsteriskMark,
  pill: PillMark,
  diamond: DiamondMark,
  dots: DotsMark,
  "double-pill": DoublePillMark,
  circle: CircleMark,
  smiley: SmileyMark,
};

/**
 * Inline decorative mark that wraps with the surrounding text.
 * Decorative — always `aria-hidden`. The sentence lives on TextSequence.
 */
export function TextSequenceShape({ variant, tone = "brand", className }: TextSequenceShapeProps) {
  const Glyph = marks[variant];
  return (
    <span
      aria-hidden="true"
      data-text-sequence-shape=""
      data-variant={variant}
      className={cn(
        textSequenceShapeBaseClasses,
        textSequenceShapeSizeClasses[variant],
        textSequenceShapeToneClasses[tone],
        className,
      )}
    >
      <Glyph />
    </span>
  );
}
