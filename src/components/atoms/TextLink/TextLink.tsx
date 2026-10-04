import type { AnchorHTMLAttributes, ReactNode } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  textLinkExternalIconClasses,
  textLinkVariantClasses,
  type TextLinkVariant,
} from "./textLinkStyles";

export { textLinkVariants, type TextLinkVariant } from "./textLinkStyles";

/** Layout-only — margin or placement; not for changing the link treatment. */
export type TextLinkLayoutClassName = string;

export interface TextLinkProps
  extends Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "href" | "target"
  > {
  href: string;
  children: ReactNode;
  /**
   * `prose` (default) — medium weight with a solid underline, for links inside body copy.
   * `quiet` — no underline at rest, an underline on hover and focus; inherits the surrounding size
   * and weight. For headline-size text and list titles.
   */
  variant?: TextLinkVariant;
  /** Opens in a new tab and appends the external-destination icon. */
  external?: boolean;
  /** Layout-only: margin or placement. */
  className?: TextLinkLayoutClassName;
}

/** Inline text navigation — the solid-underline prose link, or a quiet link for titles. */
export function TextLink({
  href,
  children,
  variant = "prose",
  external = false,
  className,
  rel,
  ...anchorProps
}: TextLinkProps) {
  const safeRel = external && rel == null ? "noopener noreferrer" : rel;

  return (
    <a
      {...anchorProps}
      href={href}
      target={external ? "_blank" : undefined}
      rel={safeRel}
      className={cn(textLinkVariantClasses[variant], className)}
    >
      {children}
      {external ? (
        <>
          <SquareArrowOutUpRight
            className={textLinkExternalIconClasses}
            strokeWidth={2}
            aria-hidden
          />
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}
