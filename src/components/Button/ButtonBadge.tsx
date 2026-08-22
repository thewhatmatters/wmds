import type { ReactNode } from "react";

/** Internal badge for Button end slots — neutral styling until standalone Badge exists. */
export function ButtonBadge({ value }: { value: number | string }) {
  const isCount = typeof value === "number";

  return (
    <span
      className={
        isCount
          ? "inline-flex h-[1.125rem] min-w-[1.125rem] shrink-0 items-center justify-center rounded-full bg-bg px-1 text-xs leading-none font-medium text-fg tabular-nums"
          : "inline-flex shrink-0 items-center rounded-full border border-border bg-surface px-1.5 py-0.5 text-xs leading-none font-medium text-muted"
      }
    >
      {value}
    </span>
  );
}

export function isBadgeShorthand(value: ReactNode): value is number | string {
  return typeof value === "number" || typeof value === "string";
}
