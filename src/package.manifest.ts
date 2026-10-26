/**
 * Package export manifest — single source for index.ts and vite externals.
 * Add a component here when it ships. `npm run build` runs scripts/validate-manifest.mjs,
 * which reads this file and fails on any drift from src/index.ts, src/components, package.json, or dist.
 * Badge stays an atom. Its leading-avatar contract (`BadgeAvatar`, `badgeAvatarSize`) is exported from `src/index.ts` — ADR-0033.
 */

const atoms = [
  "Avatar",
  "Badge",
  "Band",
  "Button",
  "Checkbox",
  "IconButton",
  "InlinePill",
  "Input",
  "Kbd",
  "Prose",
  "Radio",
  "RiveHand",
  "SectionCaption",
  "Skeleton",
  "Status",
  "Switch",
  "Table",
  "TextArea",
  "TextLink",
  "Tooltip",
] as const;

const molecules = ["Accordion", "Breadcrumb", "CalEmbed", "Card", "ChatQa", "CheckboxGroup", "Chip", "CopyField", "DescriptionList", "DisplayControls", "Dropdown", "ErrorSummary", "Field", "FloatingActionButton", "HeroIntro", "IndexList", "IntakeForm", "LinkTile", "LogView", "NavList", "Notice", "PageHeader", "PillGroup", "PromptBar", "RadioGroup", "Search", "Select", "SelectableCard", "SegmentedControl", "Stat", "StepProgress", "TaskRows", "TextSequence", "TileGrid"] as const;

const organisms = ["AppShell", "Carousel", "Chart", "ChatDock", "Confetti", "Dialog", "FilterPanel", "FooterReveal", "HeroTileStack", "IntakeConfirmation", "IntakeModal", "MoreMenu", "Panel", "ScrollHorizontal", "Sheet", "SiteNav", "Tab", "Toast"] as const;

/** In the catalog before the atomic rebuild and not rebuilt yet. Move a name into its tier when it ships. */
const planned = ["Pagination"] as const;

export const packageManifest = {
  /** Every value src/index.ts exports from src/lib/. scripts/validate-manifest.mjs checks both directions. */
  libExports: [
    { name: "cn", path: "./lib/cn" },
    { name: "buttonSizeForCluster", path: "./lib/clusterScale", reexport: "buttonSizeForCluster" },
    { name: "iconButtonSizeForCluster", path: "./lib/clusterScale", reexport: "iconButtonSizeForCluster" },
    { name: "clusterComponentSizeMap", path: "./lib/clusterScale", reexport: "clusterComponentSizeMap" },
    { name: "clusterTiers", path: "./lib/clusterScale", reexport: "clusterTiers" },
    { name: "motionTransition", path: "./lib/motion", reexport: "motionTransition" },
    { name: "motionTransitionProp", path: "./lib/motion", reexport: "motionTransitionProp" },
    { name: "focusRingTransitionClasses", path: "./lib/motion", reexport: "focusRingTransitionClasses" },
    { name: "pressScaleClass", path: "./lib/motion", reexport: "pressScaleClass" },
    { name: "motionBeatSeconds", path: "./lib/motion", reexport: "motionBeatSeconds" },
    { name: "motionBlurReveal", path: "./lib/motion", reexport: "motionBlurReveal" },
    { name: "motionStaggerSeconds", path: "./lib/motion", reexport: "motionStaggerSeconds" },
    { name: "readMotionDurationSeconds", path: "./lib/motion", reexport: "readMotionDurationSeconds" },
    { name: "chartBucketPeriodData", path: "./lib/chartTheme", reexport: "chartBucketPeriodData" },
    { name: "chartCategoricalCount", path: "./lib/chartTheme", reexport: "chartCategoricalCount" },
    { name: "chartCategoricalPalette", path: "./lib/chartTheme", reexport: "chartCategoricalPalette" },
    { name: "chartFormatAxisValue", path: "./lib/chartTheme", reexport: "chartFormatAxisValue" },
    { name: "chartFormatTooltipLabel", path: "./lib/chartTheme", reexport: "chartFormatTooltipLabel" },
    { name: "chartFormatTooltipValue", path: "./lib/chartTheme", reexport: "chartFormatTooltipValue" },
    { name: "chartNormalizePeriodData", path: "./lib/chartTheme", reexport: "chartNormalizePeriodData" },
    { name: "chartPeriodKindFromValue", path: "./lib/chartTheme", reexport: "chartPeriodKindFromValue" },
    { name: "chartSeriesColor", path: "./lib/chartTheme", reexport: "chartSeriesColor" },
    { name: "chartSeriesConfigFromKeys", path: "./lib/chartTheme", reexport: "chartSeriesConfigFromKeys" },
    { name: "chartSeriesConfigFromTone", path: "./lib/chartTheme", reexport: "chartSeriesConfigFromTone" },
    { name: "chartTooltipIndicators", path: "./lib/chartTheme", reexport: "chartTooltipIndicators" },
    { name: "chartTooltipItemsFromConfig", path: "./lib/chartTheme", reexport: "chartTooltipItemsFromConfig" },
    { name: "resolveChartPeriodDayCount", path: "./lib/chartTheme", reexport: "resolveChartPeriodDayCount" },
    { name: "resolvePeriodSegmentPreset", path: "./lib/chartTheme", reexport: "resolvePeriodSegmentPreset" },
    { name: "resolvePeriodSegments", path: "./lib/chartTheme", reexport: "resolvePeriodSegments" },
    { name: "backgroundPatterns", path: "./lib/backgroundPatterns", reexport: "backgroundPatterns" },
    { name: "backgroundPatternDiagonalLinesClasses", path: "./lib/backgroundPatterns", reexport: "backgroundPatternDiagonalLinesClasses" },
    { name: "backgroundPatternDotGridClasses", path: "./lib/backgroundPatterns", reexport: "backgroundPatternDotGridClasses" },
    { name: "GridOverlay", path: "./lib/GridOverlay" },
    { name: "GRID_ON_CLASS", path: "./lib/gridOverlayUtils", reexport: "GRID_ON_CLASS" },
    { name: "gridOverlayKeyShouldToggle", path: "./lib/gridOverlayUtils", reexport: "gridOverlayKeyShouldToggle" },
    { name: "isEditableGridOverlayTarget", path: "./lib/gridOverlayUtils", reexport: "isEditableGridOverlayTarget" },
    { name: "readGridColumnCount", path: "./lib/gridOverlayUtils", reexport: "readGridColumnCount" },
    { name: "setDocumentGridOn", path: "./lib/gridOverlayUtils", reexport: "setDocumentGridOn" },
    { name: "useSheetParam", path: "./lib/sheetParam", reexport: "useSheetParam" },
    { name: "readSheetParam", path: "./lib/sheetParam", reexport: "readSheetParam" },
    { name: "withSheetParam", path: "./lib/sheetParam", reexport: "withSheetParam" },
  ] as const,

  /** Internal filesystem/import tiers; Storybook uses ADR-0026 functional categories. */
  atomicExports: { atoms, molecules, organisms },

  /** Every shipped component export (flat). */
  componentExports: [...atoms, ...molecules, ...organisms] as const,

  /** Not exported yet — see `planned` above. */
  plannedExports: planned,

  peerDependencies: ["react", "react-dom", "motion", "@visx/visx", "lucide-react"] as const,

  /** Imports that arrive through another declared package: Chart imports `@visx/*` and the peer is `@visx/visx`. */
  umbrellaPackages: { "@visx/": "@visx/visx" } as const,

  libExternals: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "motion",
    "motion/react",
    "@visx/visx",
    "@base-ui/react/tooltip",
    "@base-ui/react/use-render",
    "@base-ui/react/navigation-menu",
    "lucide-react",
    "gsap",
    "gsap/SplitText",
    "@gsap/react",
  ] as const,

  /**
   * Rollup external prefix — Chart imports granular `@visx/*` packages for tree-shaking.
   * `gsap` covers `gsap/SplitText` and the rest of the GSAP plugin paths.
   * Only TextSequence imports GSAP (ADR-0037). The runtime stays external.
   */
  libExternalPrefixes: ["@visx/", "@rive-app/", "gsap", "@gsap/"] as const,

  /** Utilities that must appear in dist/styles.css after Tailwind CLI build. */
  requiredStyleTokens: [
    "--color-brand",
    "--color-on-brand",
    "--color-on-brand-hover",
    "--color-brand-outline",
    "--color-brand-soft",
    "bg-primary-hover",
    "duration-fast",
    "motion-collapse",
    "grid-page",
    "--grid-cols",
    "--grid-column-gap",
    "--leading-base",
    "--radius-card-body",
    "--radius-card-shell",
    "--cluster-height-sm",
    "--cluster-height-md",
    "--cluster-height-lg",
    "scroll-fade-y",
    "scroll-fade-x",
    "type-caption",
    "type-eyebrow",
    "type-reading",
  ] as const,
} as const;

export type AtomicTier = keyof typeof packageManifest.atomicExports;
export type PackageAtomExport = (typeof atoms)[number];
export type PackageMoleculeExport = (typeof molecules)[number];
export type PackageOrganismExport = (typeof organisms)[number];
export type PackageComponentExport =
  | PackageAtomExport
  | PackageMoleculeExport
  | PackageOrganismExport;
