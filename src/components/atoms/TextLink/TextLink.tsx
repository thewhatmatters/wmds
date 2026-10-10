import { useRender } from "@base-ui/react/use-render";
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from "react";
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
  /** Where the link goes. Leave it out when `render` carries the destination. */
  href?: string;
  /**
   * Compose the link onto another element (Base UI `render`) — `render={<Link href="/blog/post" />}`
   * for a router link. The treatment, the focus ring, and `external` stay the same.
   */
  render?: ReactElement;
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
  render,
  children,
  variant = "prose",
  external = false,
  className,
  rel,
  ...anchorProps
}: TextLinkProps) {
  const safeRel = external && rel == null ? "noopener noreferrer" : rel;

  if (href == null && render == null) {
    console.warn("[WMDS TextLink] Pass `href`, or `render` with a link that carries it.");
  }

  return useRender({
    render,
    defaultTagName: "a",
    props: {
      ...anchorProps,
      ...(href != null ? { href } : null),
      ...(external ? { target: "_blank" } : null),
      ...(safeRel != null ? { rel: safeRel } : null),
      className: cn(textLinkVariantClasses[variant], className),
      children: (
        <>
          {children}
          {external ? (
            <>
              <SquareArrowOutUpRight className={textLinkExternalIconClasses} strokeWidth={2} aria-hidden />
              <span className="sr-only"> (opens in a new tab)</span>
            </>
          ) : null}
        </>
      ),
    },
  });
}
