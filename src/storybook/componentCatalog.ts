/**
 * Storybook-only catalog for **Components → Overview**. Never exported from the package.
 *
 * The sidebar lists components A–Z; related exports share a family folder
 * (`Components/Button/IconButton`). Categories appear only on the Overview page.
 * `componentCatalog.test.ts` fails when an export from `src/package.manifest.ts`
 * has no entry here, or when an entry points at a Storybook title that does not exist.
 */

import { sanitize } from "storybook/internal/csf";

export const componentCategories = [
  "Action",
  "Chat",
  "Container",
  "Content",
  "Data visualization",
  "Feedback & status",
  "Form controls",
  "Layout",
  "Marketing",
  "Navigation",
  "Overlay",
  "Table & list",
] as const;

export type ComponentCategory = (typeof componentCategories)[number];

export interface ComponentCatalogEntry {
  /** Export name from `src/package.manifest.ts`. */
  name: string;
  category: ComponentCategory;
  /** One sentence: what it is for. */
  description: string;
  /** Storybook title of the docs page. Omitted for planned components. */
  title?: string;
  /** In `plannedExports` — not built yet. */
  planned?: boolean;
}

export const componentCatalog: readonly ComponentCatalogEntry[] = [
  // Action
  { name: "Button", category: "Action", title: "Components/Button/Button", description: "Pill action with six roles, plus row and nav layouts for settings lines and NavList." },
  { name: "FloatingActionButton", category: "Action", title: "Components/Button/FloatingActionButton", description: "Compact vertical menu of two to four labeled actions above a trigger." },
  { name: "IconButton", category: "Action", title: "Components/Button/IconButton", description: "Circular icon-only control for toolbars, dismiss, and icon links." },
  { name: "MoreMenu", category: "Action", title: "Components/MoreMenu", description: "Kebab trigger with a right-aligned action menu for Card headers." },

  // Chat
  { name: "ChatDock", category: "Chat", title: "Components/ChatDock", description: "Pinned prompt with suggested questions that opens into a chat window." },
  { name: "ChatQa", category: "Chat", title: "Components/ChatQa", description: "Question-and-answer thread rows." },
  { name: "PromptBar", category: "Chat", title: "Components/PromptBar", description: "Wide prompt pill that grows to three lines with an inset send button." },

  // Container
  { name: "Accordion", category: "Container", title: "Components/Accordion", description: "Expand and collapse rows with leading, label, and trailing slots." },
  { name: "Card", category: "Container", title: "Components/Card/Card", description: "Surface with header, body, and footer slots for layout cards and simple cards." },
  { name: "Carousel", category: "Container", planned: true, description: "Not built yet." },
  { name: "SelectableCard", category: "Container", title: "Components/Card/SelectableCard", description: "Multi-select card grid item with a check badge and optional toggle." },

  // Content
  { name: "Avatar", category: "Content", title: "Components/Avatar", description: "Circular identity with initials fallback and an optional presence dot." },
  { name: "Kbd", category: "Content", title: "Components/Kbd", description: "One physical keycap; compose several for a shortcut." },

  // Data visualization
  { name: "Chart", category: "Data visualization", title: "Components/Chart", description: "visx-based charts: capacity bars, ranked bars, unit grids, heatmaps, and time series." },
  { name: "Stat", category: "Data visualization", title: "Components/Stat", description: "At-a-glance metric tile with label, value, and optional trend." },

  // Feedback & status
  { name: "Badge", category: "Feedback & status", title: "Components/Badge", description: "Compact semantic label in solid or muted fill, with count, icon, and avatar patterns." },
  { name: "Confetti", category: "Feedback & status", title: "Components/Confetti", description: "Celebratory burst after an async success, fired from a provider." },
  { name: "IntakeConfirmation", category: "Feedback & status", title: "Components/IntakeConfirmation", description: "Booked or emailed confirmation that ends the Start a project flow." },
  { name: "Skeleton", category: "Feedback & status", title: "Components/Skeleton", description: "Shimmering layout placeholders that mirror the resolved UI." },
  { name: "Status", category: "Feedback & status", title: "Components/Status", description: "Task progress ring or semantic dot at a fixed scale." },
  { name: "StepProgress", category: "Feedback & status", title: "Components/StepProgress", description: "Segmented step indicator with a Step N of M label." },

  // Form controls
  { name: "CalEmbed", category: "Form controls", title: "Components/CalEmbed", description: "Calendar booking slot with a skip link." },
  { name: "Checkbox", category: "Form controls", title: "Components/Checkbox/Checkbox", description: "Boolean toggle with label, description, and validation." },
  { name: "CheckboxGroup", category: "Form controls", title: "Components/Checkbox/CheckboxGroup", description: "Multi-select options with a group validation band." },
  { name: "Chip", category: "Form controls", title: "Components/Chip", description: "Filter and toggle pill: multi-select, single-select, removable, or read-only." },
  { name: "Field", category: "Form controls", title: "Components/Field", description: "Label and layout wrapper, vertical or horizontal." },
  { name: "Input", category: "Form controls", title: "Components/Input", description: "Pill text field with optional icon, end badge, status, and loading." },
  { name: "IntakeForm", category: "Form controls", title: "Components/IntakeForm", description: "Contact details step of the Start a project flow." },
  { name: "PillGroup", category: "Form controls", title: "Components/PillGroup", description: "Wrapping radio pills for a single choice." },
  { name: "Radio", category: "Form controls", title: "Components/Radio/Radio", description: "Single option circle; compose inside RadioGroup." },
  { name: "RadioGroup", category: "Form controls", title: "Components/Radio/RadioGroup", description: "Mutually exclusive options with a group validation band." },
  { name: "Search", category: "Form controls", title: "Components/Search", description: "Hero search pill with an inset button and removable filters." },
  { name: "SegmentedControl", category: "Form controls", title: "Components/SegmentedControl", description: "Connected segments with a sliding thumb for settings and view switching." },
  { name: "Select", category: "Form controls", title: "Components/Select", description: "Pill trigger with a floating listbox." },
  { name: "Switch", category: "Form controls", title: "Components/Switch", description: "Instant on and off, with a settings-row layout." },
  { name: "TextArea", category: "Form controls", title: "Components/TextArea", description: "Multiline field with the same label, status, and loading as Input." },

  // Layout
  { name: "DisplayControls", category: "Layout", title: "Components/DisplayControls", description: "Grid visibility and theme mode controls with G and T shortcuts." },
  { name: "PageHeader", category: "Layout", title: "Components/PageHeader", description: "Page chrome row: app band, section heading, or toolbar." },

  // Marketing
  { name: "FooterReveal", category: "Marketing", title: "Components/FooterReveal", description: "Marketing page root where the content scrolls away to reveal a sticky footer." },
  { name: "HeroIntro", category: "Marketing", title: "Components/HeroIntro", description: "Marketing page h1 with an optional lead line." },
  { name: "HeroTileStack", category: "Marketing", title: "Components/HeroTileStack", description: "Hero image fan that scatters away from the pointer." },
  { name: "RiveHand", category: "Marketing", title: "Components/HeroTileStack", description: "Decorative animated hand for the marketing headline. Shown in the HeroTileStack patterns." },
  { name: "ScrollHorizontal", category: "Marketing", title: "Components/ScrollHorizontal", description: "Sticky horizontal project gallery driven by vertical scroll." },
  { name: "TextSequence", category: "Marketing", title: "Components/TextSequence", description: "Masked word-by-word reveal for headlines." },

  // Navigation
  { name: "NavList", category: "Navigation", title: "Components/NavList", description: "Sectioned secondary navigation with inset pill rows." },
  { name: "Pagination", category: "Navigation", planned: true, description: "Not built yet." },
  { name: "SiteNav", category: "Navigation", title: "Components/SiteNav", description: "Marketing site header that collapses to a pinned pill, with mega menus." },
  { name: "Tab", category: "Navigation", title: "Components/Tab", description: "Peer page and view tabs with a More overflow menu." },
  { name: "TextLink", category: "Navigation", title: "Components/TextLink", description: "Inline link inside prose, with an external variant." },

  // Overlay
  { name: "Dialog", category: "Overlay", title: "Components/Dialog", description: "Modal overlay, and AlertDialog for blocking confirmation." },
  { name: "Dropdown", category: "Overlay", title: "Components/Dropdown", description: "Shared menu panel and three-slot rows used by Select and MoreMenu." },
  { name: "IntakeModal", category: "Overlay", title: "Components/IntakeModal", description: "Full-screen Start a project shell with step progress and a pinned footer." },
  { name: "Panel", category: "Overlay", title: "Components/Panel", description: "Non-blocking edge rail; the page stays interactive." },
  { name: "Sheet", category: "Overlay", title: "Components/Sheet", description: "Dismissible bottom drawer or side panel that blocks the page." },
  { name: "Toast", category: "Overlay", title: "Components/Toast", description: "Temporary notifications in a layered deck." },
  { name: "Tooltip", category: "Overlay", title: "Components/Tooltip", description: "Short supplemental label on hover and focus." },

  // Table & list
  { name: "IndexList", category: "Table & list", title: "Components/IndexList", description: "Editorial index rows: a meta column, a large linked title, and an optional preview, under shared column captions." },
  { name: "Table", category: "Table & list", planned: true, description: "Not built yet." },
  { name: "TaskRows", category: "Table & list", title: "Components/TaskRows", description: "Expandable task rows with status, meta, and detail rails." },
];

/** Manager URL path for a title's docs page, e.g. `/docs/components-button-button--docs`. */
export function storybookDocsPath(title: string): string {
  return `/docs/${sanitize(title)}--docs`;
}
