import {
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantWellClasses,
} from "../../components/molecules/Card/cardStyles";
import { typographyClass } from "../../lib/typography";

export const chartExplorationsPageClasses =
  "grid-page min-h-screen bg-body [--grid-column-gap:8px] [--grid-max:1140px] [padding-bottom:44px]";
export const chartExplorationsContentBandClasses = "band pt-8";
export const chartExplorationsContentClasses = "band min-w-0 gap-y-6";
export const chartExplorationsHeaderClasses = "col-span-full";
export const chartExplorationsHeaderCopyClasses =
  `${typographyClass("body")} mt-1 max-w-2xl text-muted`;
export const chartExplorationsGalleryClasses =
  "band min-w-0 gap-y-6 [align-items:stretch]";
export const chartExplorationsCardClasses =
  "col-span-full h-full min-w-0 lg:col-span-6";
export const chartExplorationsBodyClasses = "flex-1";
export const chartExplorationsWellClasses =
  `flex h-full min-w-0 flex-1 flex-col justify-center gap-4 ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`;
export const chartExplorationsContractClasses =
  "flex min-w-0 flex-col items-start gap-2";
export const chartExplorationsContractCopyClasses =
  `${typographyClass("caption")} text-muted`;
