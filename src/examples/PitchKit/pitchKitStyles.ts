import { cardLayoutBodyOccupantRadiusClasses } from "../../components/molecules/Card/Card";
import { typographyClass } from "../../lib/typography";

export const pitchKitPageClasses =
  "grid-page min-h-screen bg-body [--grid-column-gap:8px] [--grid-max:1140px] [padding-bottom:44px]";

export const pitchKitTopbarBandClasses =
  "band pb-4";

export const pitchKitTopbarClasses =
  "col-span-full grid grid-cols-[1fr_auto_1fr] items-center gap-3";

export const pitchKitBrandClasses = `${typographyClass("ui-label")} text-fg`;
export const pitchKitTopbarEndClasses = "justify-self-end";

export const pitchKitContentBandClasses = "band pt-6 sm:pt-8";
export const pitchKitContentClasses =
  "band min-w-0 gap-y-6 sm:gap-y-8";

export const pitchKitHeaderSectionClasses = "col-span-full";
export const pitchKitHeaderCopyClasses = "flex max-w-2xl flex-col gap-1";
export const pitchKitSupportingClasses = `${typographyClass("body")} text-muted`;
export const pitchKitFormulaClasses = `${typographyClass("caption")} text-muted`;

export const pitchKitStatsBandClasses = "band gap-y-4";
export const pitchKitStatClasses =
  "col-span-2 md:col-span-4 lg:col-span-3";
export const pitchKitMetricsStackClasses = "band gap-y-2";

export const pitchKitDashboardGridClasses =
  "band min-w-0 gap-y-6 [align-items:stretch]";

export const pitchKitReachCardClasses = "col-span-full min-w-0 lg:col-span-6";
export const pitchKitAudienceCardClasses = "col-span-full min-w-0 lg:col-span-6";

export const pitchKitCardWellClasses =
  `flex min-w-0 flex-col gap-4 bg-body px-3.5 py-4 ${cardLayoutBodyOccupantRadiusClasses}`;

export const pitchKitAudienceWellClasses =
  `grid min-w-0 gap-y-6 bg-body px-3.5 py-4 [column-gap:var(--grid-column-gap)] sm:grid-cols-2 ${cardLayoutBodyOccupantRadiusClasses}`;

export const pitchKitAudienceSectionClasses = "flex min-w-0 flex-col gap-3";
export const pitchKitSectionEyebrowClasses = `${typographyClass("overline")} text-muted`;

export const pitchKitPostsSectionClasses = "band min-w-0 gap-y-4";
export const pitchKitPostsHeaderClasses =
  "col-span-full flex flex-wrap items-end justify-between gap-3";
export const pitchKitPostsTabsClasses = "col-span-full";
export const pitchKitPostsPanelClasses =
  "band col-span-full min-w-0 gap-y-4";
export const pitchKitPostCardClasses =
  "col-span-full min-w-0 md:col-span-4 lg:col-span-4";

export const pitchKitPostImageClasses =
  `aspect-[4/3] w-full bg-body object-cover ${cardLayoutBodyOccupantRadiusClasses}`;
export const pitchKitPostHeaderStartClasses = "flex items-center gap-2";
export const pitchKitPostMetricsClasses =
  "grid w-full grid-cols-3 gap-3";
export const pitchKitPostMetricClasses = "flex min-w-0 flex-col gap-1";
export const pitchKitPostMetricLabelClasses = `${typographyClass("overline")} text-muted`;
export const pitchKitPostMetricValueClasses =
  "font-mono text-sm tabular-nums text-fg";

export const pitchKitEmptyCardClasses =
  "col-span-full flex min-h-72 flex-col items-start justify-center gap-4";
export const pitchKitEmptyCopyClasses = "flex max-w-lg flex-col gap-2";
export const pitchKitEmptyTitleClasses = typographyClass("section-heading");
export const pitchKitEmptyBodyClasses = `${typographyClass("body")} text-muted`;

export const pitchKitPlaceholderClasses =
  "col-span-full flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center";
export const pitchKitPlaceholderTitleClasses = typographyClass("page-heading");
export const pitchKitPlaceholderBodyClasses = `${typographyClass("body")} max-w-md text-muted`;
