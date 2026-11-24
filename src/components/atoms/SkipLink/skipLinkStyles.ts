/**
 * Off screen until it has the focus, then pinned over the page's top-start corner: above a fixed
 * **SiteNav** and toasts, under dialogs and sheets (the page behind those is inert anyway).
 */
export const skipLinkClasses =
  "sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:inline-flex focus:min-h-11 " +
  "focus:items-center focus:rounded-[var(--radius-control)] focus:bg-body focus:px-4 focus:py-2 focus:text-sm " +
  "focus:font-medium focus:text-fg focus:no-underline focus:outline-none focus:ring-2 focus:ring-focus-ring";
