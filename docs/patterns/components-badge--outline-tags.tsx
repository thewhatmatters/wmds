// @thewhatmatters/wmds@0.4.4 · Pattern — outline tags
// Storybook: Components/Badge → Pattern — outline tags (?path=/story/components-badge--outline-tags)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Badge } from "@thewhatmatters/wmds";

export interface PostTag {
  label: string;
  href: string;
}

export function PostTags({ author, categories }: { author: string; categories: PostTag[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge emphasis="outline" mono>
        {author}
      </Badge>
      {categories.map((category) => (
        <Badge key={category.href} emphasis="outline" mono render={<a href={category.href} />}>
          {category.label}
        </Badge>
      ))}
    </div>
  );
}
