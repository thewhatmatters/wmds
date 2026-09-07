import type { AnchorHTMLAttributes, ReactNode } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  textLinkClasses,
  textLinkExternalIconClasses,
} from "./textLinkStyles";

/** Layout-only — margin or placement; not for changing the link treatment. */
export type TextLinkLayoutClassName = string;

export interface TextLinkProps
  extends Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "href" | "target"
  > {
  href: string;
  children: ReactNode;
  /** Opens in a new tab and appends the external-destination icon. */
  external?: boolean;
  /** Layout-only: margin or placement. */
  className?: TextLinkLayoutClassName;
}

/** Inline text navigation with the canonical dotted underline treatment. */
export function TextLink({
  href,
  children,
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
      className={cn(textLinkClasses, className)}
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
