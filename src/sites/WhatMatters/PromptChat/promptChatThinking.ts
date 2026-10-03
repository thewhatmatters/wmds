/**
 * Scripted thinking traces. One shape, four bodies. Nothing calls a model.
 * Steps plays on the landing send. Reasoning, Search, and Coding are the same trace.
 */

export const promptChatTraceKinds = ["steps", "reasoning", "search", "coding"] as const;

export type PromptChatTraceKind = (typeof promptChatTraceKinds)[number];

export const promptChatThinkingLabel = "Thinking";

/** Collapsed status copy. The live timer fills the seconds; this is the scripted end value. */
export const promptChatThoughtLabel = "Thought for 4 seconds";

/** Time between trace lines. The row stays until the last line plus the hold (~4s). */
export const promptChatTraceBeatSeconds = 0.48;

/** How long the current step shows a circle spinner before that circle becomes the check. */
export const promptChatTraceSpinSeconds = 0.32;

/** Hold after the last step so the collapsed timer can reach four seconds. */
export const promptChatTraceHoldSeconds = 2.08;

/** Format the collapsed sparkle row. Always at least one second. */
export function promptChatThoughtForLabel(seconds: number): string {
  const n = Math.max(1, Math.floor(seconds));
  return n === 1 ? "Thought for 1 second" : `Thought for ${n} seconds`;
}

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
