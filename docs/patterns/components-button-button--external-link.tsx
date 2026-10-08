// @thewhatmatters/wmds@0.4.7 · Pattern — external link
// Storybook: Components/Button/Button → Pattern — external link (?path=/story/components-button-button--external-link)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button } from "@thewhatmatters/wmds";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        role="secondary"
        size="sm"
        external
        render={<a href={"https://x.com/intent/post?url=" + encodedUrl + "&text=" + encodedTitle} />}
      >
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
    </div>
  );
}
