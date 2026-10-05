import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import { cardLayoutSectionInsetXClasses } from "../../molecules/Card/cardStyles";

export const chatDockPlacements = ["fixed", "inline"] as const;

/**
 * `fixed` — page chrome, pinned to the bottom of the viewport on the page grid.
 * `inline` — specimen in normal flow (Storybook docs, previews).
 */
export type ChatDockPlacement = (typeof chatDockPlacements)[number];

/**
 * Pinned root. The wrapper ignores pointer events so the page under its edges stays
 * clickable; only the dock takes input. Sits under **SiteNav** (`z-50`). An inline specimen
 * reserves the open window's height, so the window grows up inside it.
 */
export const chatDockRootClasses: Record<ChatDockPlacement, string> = {
  fixed:
    "pointer-events-none fixed inset-x-0 bottom-[var(--chat-dock-vv-bottom,0px)] z-40 pb-[max(1rem,env(safe-area-inset-bottom))]",
  inline: "relative flex min-h-[32rem] w-full flex-col justify-end",
};

/** While the window is on screen, phones lift the dock above **SiteNav**: the window fills the screen. */
export const chatDockRootRaisedClasses = "max-md:z-[60]";

/** While a gate fills the window, the dock and its scrim sit above **SiteNav** on every screen. */
export const chatDockRootModalClasses = "z-[60]";

/** The scrim behind a gate — the `--color-overlay` token over the whole page. A click on it folds the window. */
export const chatDockScrimClasses = "pointer-events-auto fixed inset-0 bg-overlay";

/** The dock's column — the page grid narrowed to the composer width. */
export const chatDockGridClasses = "grid-page [--grid-max:40rem]";

/** The dock: suggestion pills, the window behind the composer, and the composer. */
export const chatDockDockClasses = "pointer-events-auto relative col-span-full";

/** Hover group for the pills — only while the window is fully folded away. */
export const chatDockDockHoverClasses = "group";

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

const chatDockWindowSurfaceClasses = "overflow-hidden bg-surface font-sans text-fg shadow-soft-card";

/**
 * Chat window — an opaque card behind the composer. From `md` (and inline) it sits on the
 * composer's bottom edge and grows up and out of it: ChatDock animates its height, side insets, and
 * radius. On phones it fills the screen — the part a keyboard leaves visible
 * (`--chat-dock-vv-top` / `--chat-dock-vv-bottom`) — and rises from the bottom edge.
 */
export const chatDockWindowClasses: Record<ChatDockPlacement, string> = {
  fixed: cn(
    chatDockWindowSurfaceClasses,
    "fixed inset-x-0 top-[var(--chat-dock-vv-top,0px)] bottom-[var(--chat-dock-vv-bottom,0px)] rounded-none",
    "md:absolute md:top-auto md:bottom-0",
  ),
  inline: cn(chatDockWindowSurfaceClasses, "absolute inset-x-0 bottom-0"),
};

/**
 * Window content — the Card layout shell rhythm. The bottom padding leaves room for the composer
 * and the line under it, which sit on top of the window (`--chat-dock-composer`, measured).
 */
export const chatDockWindowContentClasses = "flex h-full flex-col gap-3 pt-4 pb-[calc(var(--chat-dock-composer,3.25rem)+0.75rem)]";

/**
 * Scrolling conversation — greeting, turns, and the thinking row. It takes focus so a keyboard can
 * scroll it when nothing inside does; the ring sits inside its edge.
 */
export const chatDockThreadClasses = cn(
  cardLayoutSectionInsetXClasses,
  "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain pb-2",
  "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring",
);

/** Assistant text — the greeting and replies. */
export const chatDockAssistantMessageClasses = cn(typographyClass("body"), "text-fg");

/** A reply with a row under it — the hover and focus group for that row. */
export const chatDockReplyClasses = "group/reply flex flex-col gap-1";

/**
 * Actions and score under a finished reply. The row always takes its height, so it never moves the
 * thread. Where the pointer can hover it shows while the reply is hovered or holds focus; on touch it
 * is always shown.
 */
export const chatDockReplyActionsClasses = cn(
  "flex min-h-11 items-center gap-1 md:min-h-9",
  "[@media(hover:hover)]:group-[:not(:hover,:focus-within)]/reply:opacity-0",
  "transition-[opacity,visibility]",
  motionTransition("fast"),
);

/** While the reply is still arriving the row keeps its place but shows nothing. */
export const chatDockReplyActionsPendingClasses = "invisible opacity-0";

/** The buttons, pulled out so the first glyph lines up with the reply text (44px circles, 36px from `md`), leaving room for the focus ring. */
export const chatDockReplyButtonsClasses = "-ms-3 flex items-center gap-1 md:-ms-2.5";

/** The score — muted caption text, not a control. */
export const chatDockReplyMetaClasses = cn(typographyClass("caption"), "text-muted tabular-nums");

/** Visitor turn — right-aligned on the brand tint, at the card body radius, so it reads apart from replies. */
export const chatDockUserMessageClasses = cn(
  typographyClass("body"),
  "ml-auto max-w-[85%] rounded-[var(--radius-card-body)] bg-brand-tint px-3.5 py-2 text-fg",
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

/** Follow-ups under the latest reply — the same rows as the window's suggestions, pulled up to the reply. */
export const chatDockFollowUpsInlineClasses = "-mt-2 flex flex-col";

/**
 * One inline follow-up. The wrapper sets the hit area — 44px on phones, the 36px cluster height from
 * `md` — and the **Button** row stretches to fill it.
 */
export const chatDockFollowUpRowClasses = "flex min-h-11 md:min-h-9";

/** Follow-ups pinned between the conversation and the composer — **Button** `secondary` pills that wrap. */
export const chatDockFollowUpsComposerClasses = cn(cardLayoutSectionInsetXClasses, "flex shrink-0 flex-wrap gap-2");

/** The composer — on top of the window, in the same place whether the window is open or not. */
export const chatDockComposerClasses = "relative";

/** The conversation or the composer once it has faded out behind a gate: kept in place, out of reach. */
export const chatDockComposerHiddenClasses = "invisible";

/**
 * The gate's layer — the whole window. On phones the footer clears the home indicator.
 */
export const chatDockGateLayerClasses: Record<ChatDockPlacement, string> = {
  fixed: "absolute inset-0 flex flex-col max-md:pb-[env(safe-area-inset-bottom,0px)]",
  inline: "absolute inset-0 flex flex-col",
};

/**
 * The brand mark at the start of the resting composer. It folds to nothing while the window is open
 * (the header shows the mark), so the field starts where a composer without a mark starts.
 */
export const chatDockMarkClasses = "flex h-9 items-center overflow-hidden";

/** The line under the open composer. Below `md` the fixed root's bottom padding follows it. */
export const chatDockDisclaimerClasses: Record<ChatDockPlacement, string> = {
  fixed: cn(typographyClass("caption"), "pt-2 text-center text-muted md:pb-3"),
  inline: cn(typographyClass("caption"), "pt-2 pb-3 text-center text-muted"),
};

/** Without a disclaimer, the window keeps the same 16px under the composer as beside it. */
export const chatDockComposerFootSpacerClasses: Record<ChatDockPlacement, string> = {
  fixed: "md:h-4",
  inline: "h-4",
};
