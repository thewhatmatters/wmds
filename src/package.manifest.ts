/**
 * Package export manifest — single source for index.ts and vite externals.
 * Add a component here when it ships. `npm run build` runs scripts/validate-manifest.mjs,
 * which reads this file and fails on any drift from src/index.ts, src/components, package.json, or dist.
 * Badge stays an atom. Its leading-avatar contract (`BadgeAvatar`, `badgeAvatarSize`) is exported from `src/index.ts` — ADR-0033.
 */

const atoms = [
  "Avatar",
  "Badge",
  "Button",
  "Checkbox",
  "IconButton",
  "Input",
  "Kbd",
  "Radio",
  "RiveHand",
  "Skeleton",
  "Status",
  "Switch",
  "TextArea",
  "TextLink",
  "Tooltip",
] as const;

const molecules = ["Accordion", "CalEmbed", "Card", "ChatQa", "CheckboxGroup", "Chip", "DisplayControls", "Dropdown", "Field", "FloatingActionButton", "HeroIntro", "IntakeForm", "NavList", "PageHeader", "PillGroup", "PromptBar", "RadioGroup", "Search", "Select", "SelectableCard", "SegmentedControl", "Stat", "StepProgress", "TaskRows", "TextSequence"] as const;

const organisms = ["Chart", "Confetti", "Dialog", "FooterReveal", "HeroTileStack", "IntakeConfirmation", "IntakeModal", "MoreMenu", "Panel", "ScrollHorizontal", "Sheet", "SiteNav", "Tab", "Toast"] as const;

/** In the catalog before the atomic rebuild and not rebuilt yet. Move a name into its tier when it ships. */
const planned = ["Carousel", "Pagination", "Table"] as const;

export const packageManifest = {
  /** Modules exported from src/index.ts today. */
  libExports: [
    { name: "cn", path: "./lib/cn" },
    { name: "buttonSizeForCluster", path: "./lib/clusterScale", reexport: "buttonSizeForCluster" },
    { name: "iconButtonSizeForCluster", path: "./lib/clusterScale", reexport: "iconButtonSizeForCluster" },
    { name: "motionTransition", path: "./lib/motion", reexport: "motionTransition" },
    { name: "motionTransitionProp", path: "./lib/motion", reexport: "motionTransitionProp" },
    { name: "focusRingTransitionClasses", path: "./lib/motion", reexport: "focusRingTransitionClasses" },
    { name: "pressScaleClass", path: "./lib/motion", reexport: "pressScaleClass" },
    { name: "GridOverlay", path: "./lib/GridOverlay" },
    { name: "GRID_ON_CLASS", path: "./lib/gridOverlayUtils", reexport: "GRID_ON_CLASS" },
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
