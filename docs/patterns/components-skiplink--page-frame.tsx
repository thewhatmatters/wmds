// @thewhatmatters/wmds@0.4.55 · Pattern — page frame
// Storybook: Components/SkipLink → Pattern — page frame (?path=/story/components-skiplink--page-frame)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import type { ReactNode } from "react";
import { SkipLink } from "@thewhatmatters/wmds";

export interface PageFrameProps {
  /** The site header: logo and navigation. */
  header: ReactNode;
  /** The page's own content. */
  children: ReactNode;
  footer?: ReactNode;
}

export function PageFrame({ header, children, footer }: PageFrameProps) {
  return (
    <>
      <SkipLink />
      {header}
      <main id="main" className="outline-none">
        {children}
      </main>
      {footer}
    </>
  );
}
