import { cn } from "../../../lib/cn";
import { navRailBrandMarkClasses } from "./navRailStyles";

/** Default WhatMatters sparkle — static; never uses nav item chrome. */
export function NavRailBrandMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(navRailBrandMarkClasses, className)}
    >
      <path
        clipRule="evenodd"
        d="m0 24c15.2548 0 24-8.7452 24-24 0 15.2548 8.7452 24 24 24-15.2548 0-24 8.7452-24 24 0-15.2548-8.7452-24-24-24z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
