import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Centered reading column for Foundation token pages.
 * Storybook canvas is fullscreen by default — without this, specimens pin to the
 * left edge of a tall empty frame.
 */
export function FoundationSpecimen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full", className)}>{children}</div>;
}
