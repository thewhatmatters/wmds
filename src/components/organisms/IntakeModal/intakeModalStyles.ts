import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";

export const intakeModalRootClasses = cn(
  "fixed inset-0 z-[100] flex h-dvh flex-col bg-body text-fg",
);

export const intakeModalHeaderClasses =
  "flex h-16 shrink-0 items-center justify-between border-b border-border px-4 md:px-8";

export const intakeModalBrandClasses = "flex items-center gap-2";

/** Typographic WM mark — there is no separate logo asset. */
export const intakeModalMarkClasses =
  "font-sans text-[length:var(--font-size-xl)] font-bold leading-none tracking-[-0.04em] text-brand";

export const intakeModalWordmarkClasses =
  "font-sans text-[length:var(--font-size-lg)] font-medium leading-none tracking-normal text-brand";

export const intakeModalProgressClasses = "mx-auto w-full max-w-3xl shrink-0 px-4 py-4 md:px-8";

export const intakeModalBodyClasses = "min-h-0 flex-1 overflow-y-auto";

export const intakeModalContentClasses =
  "mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 md:px-8 md:py-14";

/** Confirmation body — fills the scrollport and centers the block. */
export const intakeModalCenteredContentClasses =
  "mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-10 md:px-8";

/** Pinned under the scrolling step on every width, including mobile. */
export const intakeModalFooterClasses = cn(
  "flex shrink-0 items-center justify-between gap-3 border-t border-border bg-body px-4 py-4 md:px-8",
  "pb-[max(1rem,env(safe-area-inset-bottom))]",
  motionTransition("fast"),
);
