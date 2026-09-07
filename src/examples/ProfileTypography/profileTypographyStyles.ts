import { typographyClass } from "../../lib/typography";

export const profilePageClasses =
  "grid-page min-h-screen bg-body py-12 sm:py-16 lg:py-20";

export const profileArticleClasses =
  "col-span-full flex max-w-[52rem] flex-col sm:col-start-2 sm:col-span-6 lg:col-start-2 lg:col-span-10";

export const profileIdentityClasses = "flex flex-col items-start gap-4";
export const profileTitleClasses = typographyClass("page-heading");
export const profileAliasClasses = `${typographyClass("body")} text-muted`;

export const profileProseClasses = "mt-8 flex flex-col gap-5 sm:mt-10";
export const profileParagraphClasses = typographyClass("body");

export const profileSectionClasses = "mt-12 sm:mt-14";
export const profileSectionLabelClasses = `${typographyClass("body")} text-muted`;
export const profileWorkListClasses = "mt-4 border-t border-border";
export const profileWorkItemClasses = "border-b border-border py-2";
export const profileWorkStartClasses = "flex min-w-0 items-center gap-3";
export const profileWorkCopyClasses = "flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5";
export const profileWorkTitleClasses = typographyClass("ui-label");
export const profileWorkDatesClasses = typographyClass("caption");
export const profileFooterClasses = "mt-12 flex flex-col gap-5 sm:mt-14";
