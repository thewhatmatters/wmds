import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { pageHeaderAppBandHeightClasses } from "../PageHeader/pageHeaderStyles";

export const navListLabelAlignments = ["brand", "section"] as const;

export type NavListLabelAlignment = (typeof navListLabelAlignments)[number];

/** Secondary nav column — default width matches shell **SideNav** host (`w-52`). */
export const navListShellClasses = "flex h-full min-h-0 w-52 flex-col";

export const navListSectionClasses = "flex flex-col gap-1";

/** 56px band — first section label aligns with **PageHeader** `variant="app"` + **NavRail** logo. */
export const navListSectionBrandBandClasses = cn(
  "box-border flex shrink-0 items-center px-4",
  pageHeaderAppBandHeightClasses,
);

export const navListSectionLabelClasses = cn(typographyClass("overline"), "text-muted");

export const navListSectionLabelBrandClasses = navListSectionLabelClasses;

export const navListSectionLabelDefaultClasses = cn(
  navListSectionLabelClasses,
  "px-4 pb-1 pt-3",
);

export const navListItemWrapClasses = "relative w-full px-2";

export const navListItemLabelClasses = "min-w-0 flex-1 truncate text-left";

export const navListItemCountClasses = cn(
  "ml-auto tabular-nums",
  typographyClass("caption"),
  "text-muted",
);

export function navListItemIconClasses(selected: boolean) {
  return selected ? "text-fg" : "text-muted";
}
