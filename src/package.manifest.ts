/**
 * Package export manifest — single source for index.ts, tsconfig.lib, and vite externals.
 * Add a component here when it ships; run `npm run validate:manifest` before publish.
 */

const atoms = [
  "Badge",
  "Button",
  "IconButton",
  "Input",
  "StatusDot",
  "StatusRing",
  "TextArea",
] as const;

const molecules = ["Accordion", "Card", "Chip", "Field", "List", "Pagination", "Search", "Select", "TaskRows"] as const;

const organisms = ["Carousel", "Chart", "MoreMenu", "Tab", "Table"] as const;

export const packageManifest = {
  /** Modules exported from src/index.ts today. */
  libExports: [
    { name: "cn", path: "./lib/cn" },
    { name: "motionTransition", path: "./lib/motion", reexport: "motionTransition" },
    { name: "motionTransitionProp", path: "./lib/motion", reexport: "motionTransitionProp" },
    { name: "focusRingTransitionClasses", path: "./lib/motion", reexport: "focusRingTransitionClasses" },
    { name: "pressScaleClass", path: "./lib/motion", reexport: "pressScaleClass" },
    { name: "GridOverlay", path: "./lib/GridOverlay" },
    { name: "GRID_ON_CLASS", path: "./lib/gridOverlay", reexport: "GRID_ON_CLASS" },
  ] as const,

  /** Atomic tiers — Storybook title must match: Atoms/{Name}, Molecules/{Name}, Organisms/{Name}. */
  atomicExports: { atoms, molecules, organisms },

  /** All planned component exports (flat). */
  componentExports: [...atoms, ...molecules, ...organisms] as const,

  peerDependencies: ["react", "react-dom", "motion"] as const,

  libExternals: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "motion",
    "motion/react",
    "recharts",
    "lucide-react",
  ] as const,

  /** Utilities that must appear in dist/styles.css after Tailwind CLI build. */
  requiredStyleTokens: [
    "bg-primary-hover",
    "duration-fast",
    "motion-collapse",
    "grid-page",
    "--grid-cols",
    "--leading-base",
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
