import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { skipLinkClasses } from "./skipLinkStyles";

/** Layout-only — where the shown link sits (`focus:top-20` under a tall bar); not for re-colouring it. */
export type SkipLinkLayoutClassName = string;

export interface SkipLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href"> {
  /** The `id` of the region to jump to, without the `#`. Default `main`. */
  target?: string;
  /** The link's words. Default "Skip to content". */
  children?: ReactNode;
  className?: SkipLinkLayoutClassName;
}

/**
 * Moves the focus to the region with this `id`, so the next Tab starts inside it. A region that
 * can't take the focus (`main`, `div`) gets `tabindex="-1"` first. Answers whether it found one.
 */
export function focusSkipTarget(target: string): boolean {
  const region = document.getElementById(target);
  if (!region) return false;
  if (!region.hasAttribute("tabindex") && region.tabIndex < 0) region.setAttribute("tabindex", "-1");
  region.focus();
  return true;
}

/**
 * "Skip to content": the first stop for Tab on a page, hidden until it has the focus, so someone on
 * a keyboard needn't step through the header on every page. Put it first in `body` and give the
 * page's `main` the matching `id`. **AppShell** already carries one; this is for pages without it.
 */
export function SkipLink({ target = "main", children = "Skip to content", className, onClick, ...props }: SkipLinkProps) {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    // Focus the region without writing a hash into the URL, which an app's router may own.
    // With no such region on the page, the link stays a plain in-page link.
    if (focusSkipTarget(target)) event.preventDefault();
  };

  return (
    <a {...props} href={`#${target}`} className={cn(skipLinkClasses, className)} onClick={skip}>
      {children}
    </a>
  );
}
