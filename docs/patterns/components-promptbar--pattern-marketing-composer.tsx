// @thewhatmatters/wmds@0.3.0 · Pattern — marketing composer
// Storybook: Components/PromptBar → Pattern — marketing composer (?path=/story/components-promptbar--pattern-marketing-composer)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { PromptBar } from "@thewhatmatters/wmds";

/**
 * Marketing homepage composer, pinned to the bottom of the viewport on the page grid.
 * Sending hands off to the app's ask page: route to /ask?q=<prompt>, and the ask page
 * starts the conversation with `q` as its first prompt.
 * Next.js: onHandOff={(prompt) => router.push(`/ask?q=${encodeURIComponent(prompt)}`)}
 */
export function MarketingComposer({ onHandOff }: { onHandOff: (prompt: string) => void }) {
  const [draft, setDraft] = useState("");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="grid-page [--grid-max:40rem]">
        <div className="band">
          <div className="pointer-events-auto col-span-full">
            <PromptBar
              value={draft}
              onValueChange={setDraft}
              onSend={(value) => {
                const prompt = value.trim();
                if (prompt.length === 0) return;
                setDraft("");
                onHandOff(prompt);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
