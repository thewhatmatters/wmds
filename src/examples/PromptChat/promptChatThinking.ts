/**
 * Scripted thinking traces. One shape, four bodies. Nothing calls a model.
 * Steps plays on the landing send. Reasoning, Search, and Coding are the same trace.
 */

export const promptChatTraceKinds = ["steps", "reasoning", "search", "coding"] as const;

export type PromptChatTraceKind = (typeof promptChatTraceKinds)[number];

export const promptChatThinkingLabel = "Thinking";

export const promptChatThoughtLabel = "Thought for a few seconds";

/** Time between trace lines. The row collapses after the last line plus the hold. */
export const promptChatTraceBeatSeconds = 0.48;

export const promptChatTraceHoldSeconds = 0.55;

export type PromptChatTraceEntry =
  | { kind: "check"; text: string }
  | { kind: "prose"; text: string }
  | { kind: "query"; text: string }
  | { kind: "source"; text: string; href: string }
  | { kind: "file"; text: string }
  | { kind: "edit"; text: string }
  | { kind: "command"; text: string };

export const promptChatTraces: Record<PromptChatTraceKind, PromptChatTraceEntry[]> = {
  steps: [
    { kind: "check", text: "Read the brief" },
    { kind: "check", text: "Name the brand" },
    { kind: "check", text: "Check the product site" },
    { kind: "check", text: "Find the studio notes" },
  ],
  reasoning: [
    { kind: "prose", text: "Brand, product, and the site have to say the same thing." },
    { kind: "prose", text: "The notes are where that line gets written down." },
  ],
  search: [
    { kind: "query", text: "sites that explain the brand" },
    { kind: "source", text: "Studio notes", href: "/notes" },
    { kind: "source", text: "Product", href: "/product" },
    { kind: "source", text: "What we make", href: "/services" },
  ],
  coding: [
    { kind: "file", text: "brief.md" },
    { kind: "file", text: "homepage.tsx" },
    { kind: "edit", text: "Set the brand line in brief.md" },
    { kind: "command", text: "npm run validate:composition" },
  ],
};

export function promptChatTraceDurationSeconds(count: number, reduce = false): number {
  if (reduce || count <= 0) return 0;
  return count * promptChatTraceBeatSeconds + promptChatTraceHoldSeconds;
}
