// @thewhatmatters/wmds@0.4.3 · Pattern — post metadata
// Storybook: Components/DescriptionList → Pattern — post metadata (?path=/story/components-descriptionlist--post-metadata)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Badge, Button, DescriptionList } from "@thewhatmatters/wmds";

export interface PostMetadataProps {
  /** ISO date, for the time element. */
  date: string;
  dateLabel: string;
  author: string;
  readingTime: string;
  categories: { label: string; href: string }[];
  shareUrl: string;
}

export function PostMetadata({ date, dateLabel, author, readingTime, categories, shareUrl }: PostMetadataProps) {
  const encodedUrl = encodeURIComponent(shareUrl);
  return (
    <DescriptionList variant="mono" rule="dotted">
      <DescriptionList.Item name="Date">
        <time dateTime={date}>{dateLabel}</time>
      </DescriptionList.Item>
      <DescriptionList.Item name="Author">
        <Badge emphasis="outline" mono>
          {author}
        </Badge>
      </DescriptionList.Item>
      <DescriptionList.Item name="Reading time">{readingTime}</DescriptionList.Item>
      <DescriptionList.Item name="Categories">
        {categories.map((category) => (
          <Badge key={category.href} emphasis="outline" mono render={<a href={category.href} />}>
            {category.label}
          </Badge>
        ))}
      </DescriptionList.Item>
      <DescriptionList.Item name="Share" layout="stacked">
        <Button role="secondary" size="sm" external render={<a href={"https://x.com/intent/post?url=" + encodedUrl} />}>
          Twitter/X
        </Button>
        <Button
          role="secondary"
          size="sm"
          external
          render={<a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl} />}
        >
          LinkedIn
        </Button>
      </DescriptionList.Item>
    </DescriptionList>
  );
}
