import { cn } from "../../../lib/cn";

export const proseSizes = ["lg", "md"] as const;

/**
 * `lg` (default) — long-form reading: `type-reading` (17px at a 28px line), headings a step up.
 * `md` — denser copy on `type-body` (14px), such as a resource category's notes.
 */
export type ProseSize = (typeof proseSizes)[number];

export const proseMeasures = ["reading", "none"] as const;

/** `reading` (default) caps the line at 40rem — about 70 characters at `lg`. `none` fills the column. */
export type ProseMeasure = (typeof proseMeasures)[number];

export const proseElements = ["div", "article", "section"] as const;

export type ProseElement = (typeof proseElements)[number];

export const proseMeasureClasses: Record<ProseMeasure, string> = {
  reading: "max-w-[40rem]",
  none: "",
};

/** Body type, block rhythm, and heading steps per size. */
export const proseSizeClasses: Record<ProseSize, string> = {
  lg: cn(
    "type-reading",
    "[&>*+*]:mt-6",
    "[&_h2]:type-heading-1 [&>*+h2]:mt-12 [&>h2+*]:mt-4",
    "[&_h3]:type-heading-2 [&>*+h3]:mt-10 [&>h3+*]:mt-3",
    "[&_:is(h4,h5,h6)]:type-heading-3 [&>*+:is(h4,h5,h6)]:mt-8 [&>:is(h4,h5,h6)+*]:mt-2",
    "[&_li+li]:mt-2 [&_li>*+*]:mt-2",
  ),
  md: cn(
    "type-body",
    "[&>*+*]:mt-5",
    "[&_h2]:type-heading-2 [&>*+h2]:mt-10 [&>h2+*]:mt-3",
    "[&_h3]:type-heading-3 [&>*+h3]:mt-8 [&>h3+*]:mt-2",
    "[&_:is(h4,h5,h6)]:type-heading-4 [&>*+:is(h4,h5,h6)]:mt-6 [&>:is(h4,h5,h6)+*]:mt-2",
    "[&_li+li]:mt-1.5 [&_li>*+*]:mt-1.5",
  ),
};

/** Plain HTML elements inside — the markdown a renderer outputs. */
export const proseElementClasses = cn(
  "min-w-0 text-fg",
  // Headings
  "[&_:is(h2,h3,h4,h5,h6)]:text-fg [&_:is(h2,h3,h4,h5,h6)]:text-balance [&_:is(h2,h3,h4,h5,h6)]:scroll-mt-24",
  // Links — the TextLink prose treatment, for links the renderer does not map to TextLink
  "[&_a]:font-medium [&_a]:text-fg [&_a]:underline [&_a]:decoration-solid [&_a]:decoration-border-emphasized [&_a]:underline-offset-4",
  "[&_a]:transition-[color,text-decoration-color] [&_a]:duration-fast [&_a]:ease-standard [&_a:hover]:decoration-fg",
  "[&_a:focus-visible]:rounded-sm [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-focus-ring [&_a:focus-visible]:ring-offset-2 [&_a:focus-visible]:ring-offset-body",
  // Emphasis
  "[&_strong]:font-semibold [&_strong]:text-fg",
  // Lists
  "[&_ul]:list-disc [&_ol]:list-decimal [&_:is(ul,ol)]:pl-6 [&_li]:pl-1 [&_li::marker]:text-muted [&_li>:is(ul,ol)]:mt-2",
  // Quotes
  "[&_blockquote]:border-l-2 [&_blockquote]:border-border-emphasized [&_blockquote]:pl-5 [&_blockquote>*+*]:mt-4",
  // Inline code
  "[&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-ghost-hover [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.875em]",
  // Code blocks
  "[&_pre]:overflow-x-auto [&_pre]:rounded-[var(--radius-card-body)] [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:type-code [&_pre]:text-fg",
  // Rules
  "[&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border [&>*+hr]:mt-10 [&>hr+*]:mt-10",
  // Images and figures
  "[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[var(--radius-card-body)]",
  "[&_figcaption]:mt-2 [&_figcaption]:type-supporting [&_figcaption]:text-muted",
  // Tables — a wide table scrolls inside its own box
  "[&_table]:block [&_table]:w-max [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:type-body",
  "[&_th]:border-b [&_th]:border-border-emphasized [&_th]:py-2 [&_th]:pr-6 [&_th]:text-left [&_th]:align-bottom [&_th]:type-label",
  "[&_td]:border-b [&_td]:border-border [&_td]:py-2 [&_td]:pr-6 [&_td]:align-top",
);
