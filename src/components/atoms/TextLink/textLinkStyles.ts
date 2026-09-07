import { motionTransition } from "../../../lib/motion";

export const textLinkClasses =
  "font-medium text-fg underline decoration-dotted decoration-border-emphasized underline-offset-4 " +
  "transition-[color,text-decoration-color] " +
  motionTransition("fast") +
  " hover:decoration-fg focus-visible:rounded-sm focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body";

export const textLinkExternalIconClasses =
  "ml-0.5 inline-block size-[0.85em] align-[0.05em] stroke-current";
