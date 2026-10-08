// @thewhatmatters/wmds@0.4.7 · Pattern — article body
// Storybook: Components/Prose → Pattern — article body (?path=/story/components-prose--article-body)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import type { ReactNode } from "react";
import { Prose } from "@thewhatmatters/wmds";

/** Pass the rendered markdown (markdown-to-jsx, MDX, or remark output) as children. */
export function ArticleBody({ children }: { children: ReactNode }) {
  return <Prose as="article">{children}</Prose>;
}
