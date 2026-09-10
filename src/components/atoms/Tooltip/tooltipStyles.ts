import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";

export const tooltipPositionerClasses = "z-50 max-w-[min(16rem,calc(100vw-1rem))]";

export const tooltipPopupClasses = [
  typographyClass("caption").replace("text-muted", "text-on-accent"),
  "pointer-events-none max-w-full rounded-md bg-accent px-2 py-1 text-balance shadow-sm",
  "origin-[var(--transform-origin)] transition-[opacity,transform]",
  motionTransition("fast-min"),
  "data-starting-style:scale-95 data-starting-style:opacity-0",
  "data-ending-style:scale-95 data-ending-style:opacity-0",
  "data-instant:transition-none motion-reduce:transition-none",
].join(" ");

export const tooltipArrowClasses = "size-2 rotate-45 bg-accent";
