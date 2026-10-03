import { motionDurationFallbackMs, motionStaggerSeconds } from "../../../lib/motion";

export type PromptChatReplyPart =
  | { kind: "word"; text: string }
  | { kind: "source"; text: string; href: string };

/**
 * Scripted reply. The source sits in the sentence and waits until the word
 * before it has finished arriving.
 */
export const promptChatReplyParts: PromptChatReplyPart[] = [
  { kind: "word", text: "Brand," },
  { kind: "word", text: "product," },
  { kind: "word", text: "and" },
  { kind: "word", text: "the" },
  { kind: "word", text: "sites" },
  { kind: "word", text: "that" },
  { kind: "word", text: "explain" },
  { kind: "word", text: "them." },
  { kind: "word", text: "The" },
  { kind: "source", text: "studio notes", href: "/notes" },
  { kind: "word", text: "cover" },
  { kind: "word", text: "how" },
  { kind: "word", text: "a" },
  { kind: "word", text: "project" },
  { kind: "word", text: "starts." },
];

export const promptChatSampleReply = promptChatReplyParts.map((part) => part.text).join(" ");

/** Prompts the user could send next. Usable once the stream has finished. */
export const promptChatFollowUps = [
  "What does a brand engagement include?",
  "How do you start a product design?",
];

/** Gap between ordinary words. The source waits out a full fast-tier arrival. */
export const promptChatWordStaggerSeconds = motionStaggerSeconds(null);

export function promptChatPartDelay(
  index: number,
  reduce = false,
  settleSeconds = motionDurationFallbackMs.fast / 1000,
): number {
  if (reduce || index <= 0) return 0;
  let time = 0;
  for (let i = 0; i < index; i += 1) {
    const part = promptChatReplyParts[i];
    const next = promptChatReplyParts[i + 1];
    const hold = part?.kind === "source" || next?.kind === "source";
    time += hold ? settleSeconds : promptChatWordStaggerSeconds;
  }
  return time;
}
