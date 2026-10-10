// @thewhatmatters/wmds@0.4.9 · Pattern — prompt bar
// Storybook: Components/PromptBar → Pattern — prompt bar (?path=/story/components-promptbar--pattern-prompt-bar)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { PromptBar } from "@thewhatmatters/wmds";

export function AskPrompt() {
  const [draft, setDraft] = useState("");

  return (
    <PromptBar
      value={draft}
      onValueChange={setDraft}
      onSend={() => {
        setDraft("");
      }}
    />
  );
}
