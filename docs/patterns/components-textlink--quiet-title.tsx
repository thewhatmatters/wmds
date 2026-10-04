// @thewhatmatters/wmds@0.4.1 · Pattern — quiet title link
// Storybook: Components/TextLink → Pattern — quiet title link (?path=/story/components-textlink--quiet-title)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { TextLink } from "@thewhatmatters/wmds";

export function PostTitle({ title, href }: { title: string; href: string }) {
  return (
    <h2 className="type-display-3 text-fg">
      <TextLink variant="quiet" href={href}>
        {title}
      </TextLink>
    </h2>
  );
}
