import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import {
  cardBaseClasses,
  cardLayoutSectionInsetXClasses,
  cardLayoutShellClasses,
  cardLayoutShellShapeClasses,
  cardLayoutShellTopClasses,
} from "../../molecules/Card/cardStyles";

export const chatDockPlacements = ["fixed", "inline"] as const;

/**
 * `fixed` — page chrome, pinned to the bottom of the viewport on the page grid.
 * `inline` — specimen in normal flow (Storybook docs, previews).
 */
export type ChatDockPlacement = (typeof chatDockPlacements)[number];

/**
 * Pinned root. The wrapper ignores pointer events so the page under its edges stays
 * clickable; only the dock takes input. Sits under **SiteNav** (`z-50`).
 */
export const chatDockRootClasses: Record<ChatDockPlacement, string> = {
  fixed: "pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[max(1rem,env(safe-area-inset-bottom))]",
  inline: "relative w-full",
};

/** The dock's column — the page grid narrowed to the composer width. */
export const chatDockGridClasses = "grid-page [--grid-max:40rem]";

/** Hover group: the composer plus the suggestion pills above it. */
export const chatDockDockClasses = "group pointer-events-auto relative col-span-full";

/**
 * Suggestion pills above the resting composer. Hidden until the dock is hovered; Tailwind's
 * `hover` variants only apply on hover-capable pointers, so touch never shows them (the open
 * window lists the same suggestions). Bottom padding, not margin, keeps the gap inside the hover
 * area so the pointer can travel from the bar to a pill.
 */
export const chatDockPillsClasses = cn(
  "absolute inset-x-0 bottom-full flex flex-wrap justify-center gap-2 pb-3",
  "invisible group-hover:visible transition-[visibility]",
  motionTransition("fast"),
);

/**
 * One pill. Each rises in one `--motion-stagger` after the one before it (index from
 * `--chat-dock-pill-index`); all leave together.
 */
export const chatDockPillClasses = cn(
  "inline-flex translate-y-2 opacity-0",
  "group-hover:translate-y-0 group-hover:opacity-100",
  "group-hover:[transition-delay:calc(var(--motion-stagger)*var(--chat-dock-pill-index,0))]",
  "motion-reduce:translate-y-0",
  "transition-[opacity,transform]",
  motionTransition("fast"),
);

/**
 * Chat window — the Card layout shell on the elevated surface. Phones get the whole viewport
 * (above **SiteNav**); from `md` it sits where the composer was, at a fixed height so arriving
 * messages scroll inside instead of growing the window.
 */
export const chatDockWindowClasses: Record<ChatDockPlacement, string> = {
  fixed: cn(
    cardBaseClasses,
    cardLayoutShellClasses,
    cardLayoutShellTopClasses(),
    "pointer-events-auto col-span-full bg-surface shadow-soft-card",
    "fixed inset-0 z-[60] rounded-none",
    "md:relative md:inset-auto md:z-auto md:h-[min(40rem,calc(100svh-7rem))]",
    /* Literal so Tailwind's scanner sees it — the same radius as cardLayoutShellShapeClasses.rounded. */
    "md:rounded-[var(--radius-card-shell)]",
  ),
  inline: cn(
    cardBaseClasses,
    cardLayoutShellClasses,
    cardLayoutShellTopClasses(),
    cardLayoutShellShapeClasses.rounded,
    "col-span-full h-[32rem] bg-surface shadow-soft-card",
  ),
};

/** Scrolling conversation — greeting, turns, and the thinking row. */
export const chatDockThreadClasses = cn(
  cardLayoutSectionInsetXClasses,
  "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain pb-2",
);

/** Assistant text — the greeting and replies. */
export const chatDockAssistantMessageClasses = cn(typographyClass("body"), "text-fg");

/** Visitor turn — right-aligned on the muted fill, at the card body radius. */
export const chatDockUserMessageClasses = cn(
  typographyClass("body"),
  "ml-auto max-w-[85%] rounded-[var(--radius-card-body)] bg-muted-surface px-3.5 py-2 text-fg",
);

export const chatDockThinkingClasses = cn(
  typographyClass("caption"),
  "flex items-center gap-2 text-muted",
);

/** Suggestion rows in the window — above the composer, under a hairline. */
export const chatDockSuggestionListClasses = cn(
  cardLayoutSectionInsetXClasses,
  "flex shrink-0 flex-col gap-1 border-t border-border pt-3",
);

/** Icon + label inside a **Button** `layout="row"` suggestion. */
export const chatDockSuggestionRowContentClasses = cn(
  typographyClass("body"),
  "flex min-w-0 items-center gap-3 text-muted",
);

export const chatDockSuggestionLabelClasses = "min-w-0 truncate";

export const chatDockComposerClasses = cn(cardLayoutSectionInsetXClasses, "shrink-0");

export const chatDockDisclaimerClasses = cn(
  typographyClass("caption"),
  cardLayoutSectionInsetXClasses,
  "shrink-0 pb-3 text-center text-muted",
);
