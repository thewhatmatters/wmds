// @thewhatmatters/wmds@0.3.0 · Pattern — Q&A with reply
// Storybook: Components/ChatQa → Pattern — Q&A with reply (?path=/story/components-chatqa--pattern-qa-with-reply)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { ChatQa } from "@thewhatmatters/wmds";

const pairs = [
  { question: "What are you shipping next?", answer: "A new feature" },
  { question: "Which platforms does it need to cover?", answer: "Web, Chrome extension" },
  {
    question: "Rank WhatMatters most for this launch",
    answer: "Ranked: 1. Speed to ship, 2. Polish, 3. Marketing readiness, 4. Test coverage",
  },
];

export function IntakeAnswersInThread() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <ChatQa pairs={pairs} />
      <p className="type-body text-fg">
        That&apos;s the full loop — shipping surface, platforms, and what to optimize for first. Next we would sketch the feature path, then pin the Chrome extension shell so the web cut and the extension stay on one system.
      </p>
    </div>
  );
}
