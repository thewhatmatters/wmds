export const kbdSizes = ["sm", "md"] as const;

export type KbdSize = (typeof kbdSizes)[number];

export const kbdBaseClasses =
  "inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-body font-mono font-medium leading-none text-fg shadow-[0_1px_0_0_var(--color-border-emphasized)]";

export const kbdSizeClasses: Record<KbdSize, string> = {
  sm: "h-5 min-w-5 px-1 text-[0.625rem]",
  md: "h-6 min-w-6 px-1.5 text-xs",
};
