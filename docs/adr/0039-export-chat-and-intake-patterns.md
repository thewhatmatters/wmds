# ADR-0039: The site assistant is ChatDock, not a chat page

**Status:** Accepted — 2026-10-04 (reviewed by Randy).
**Date:** 2026-10-03, revised 2026-10-04
**Amends:** ADR-0004 (Pattern-first — not utility-first), rule 4 “Examples are templates”.

## Context

The WhatMatters site asked questions through a full ask page: a landing headline, a thread that grew down the page, a scripted thinking trace, follow-ups, and an in-thread Start Project gate. It was Storybook Show code — about 900 lines that the site pasted as `components/ask-what-matters.tsx` (974 lines) and that drifted from WMDS with every fix. The homepage pinned a **PromptBar** that handed off to that page (`/ask?q=…`).

The first draft of this ADR proposed exporting that page as four components (`ChatThread`, `ChatPage`, `StartProjectGate`, `MarketingComposer`). In review the direction changed: a full chat experience is more than the site needs. Visitors need quick answers without leaving the page they are on.

Two rules still hold from the first draft:

- **Patterns are templates until they carry behavior.** A pattern whose Show code owns state machines, timers, measurement, scroll management, or choreography ships as a component; content, data, copy, and handlers are props.
- **WMDS never fetches, routes, or calls a model.** The app owns the request and the conversation.

## Decision

### ChatDock

One organism replaces the ask page and the marketing composer.

| State | What the visitor sees |
|-------|-----------------------|
| **At rest** | A **PromptBar** pinned to the bottom of the page grid (`--grid-max: 40rem`, under **SiteNav**) with the brand mark in its `start` slot. |
| **Hover** | Suggested questions (suggestions with a `prompt`) as **Button** `secondary` pills above the bar, one stagger apart. Hover only: touch devices never see them. |
| **Open** | Focusing, clicking, or typing into the bar opens a chat window that grows up out of it: the shared overlay header (mark, title, subtitle, close), the greeting, the conversation, a thinking row, the suggestions as **Button** `layout="row"` rows until the first message, the composer, and a one-line disclaimer. Escape or close folds it back into the bar. |

- **Not modal.** The page behind stays usable; there is no scrim or focus trap. Below `md` the window fills the screen.
- **Send is the composer's arrow.** The header has close only — no second send or expand arrow.
- **No voice.** **PromptBar** gains an `end` slot so a mic can be added later without a redesign.
- **The app owns the conversation.** `messages` (`{ id, role, content }`), `thinking`, `onSend`. `content` is text or Markdown the app has already rendered; WMDS does not parse Markdown yet.
- **Actions are suggestions without a prompt.** **Start a project** calls `onSuggestionSelect`, and the app opens **IntakeModal**. The in-chat Start Project gate stays out of WMDS.
- **English defaults** for every label (`labels` overrides them). **No analytics hooks** — tracking goes through the app's handlers.

```tsx
<ChatDock
  title="WhatMatters"
  subtitle="Ask anything"
  mark={<Avatar name="WhatMatters" size="md" />}
  greeting="Hi, I'm the WhatMatters assistant…"
  messages={messages}
  thinking={thinking}
  suggestions={suggestions}
  onSend={send}
  onSuggestionSelect={(s) => s.id === "start" && openIntake()}
  disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
/>
```

### Retired

- **Components/PromptBar → Pattern — marketing composer** (the pinned bar that handed off to `/ask`).
- The full-page chat. It already left WMDS with **Sites/** (ADR-0026); the site retires its `/ask` page.
- `ChatThread`, `ChatPage`, `StartProjectGate`, and `MarketingComposer` from the first draft are not built.

## Consequences

- The site deletes `components/ask-what-matters.tsx`, its `/ask` route, and the pasted marketing composer, and mounts one **ChatDock** from **Pattern — chat dock**.
- Upgrades fix the assistant with `npm install`, not a re-paste.
- WMDS tests the behavior: Internal/Interactions/ChatDock covers opening on focus and click, Escape and close, focus returning to the bar without reopening, sending typed text and suggestion prompts, and action suggestions.
- Releasing this removes a shipped pattern, so it is a minor version (0.4.0).

## Related

- ADR-0004 — pattern-first (amended here)
- ADR-0006 — input architecture (PromptBar)
- ADR-0008 — motion tiers (the reveal is the medium tier; pills and turns are fast, staggered by `--motion-stagger`)
- ADR-0016 — overlays (the shared overlay header)
- ADR-0026 — Storybook catalog (Sites removed)
- ADR-0038 — intake modal (Start a project)
