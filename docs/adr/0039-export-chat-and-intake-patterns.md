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
- **Actions are suggestions without a prompt.** **Start a project** calls `onSuggestionSelect`, and the app opens **IntakeModal**. The in-chat Start Project gate stays out of WMDS. *(Reversed 2026-10-04: see the gate amendment below.)*
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

### Amendment — 2026-10-04: follow-ups

The site wants a few predefined next questions after some replies. Before this, the window showed suggestion rows only until the first message, so the app had nowhere to put them except inside `messages[].content` — inventing a chat pattern in the site.

- **`followUps?: ChatDockSuggestion[]`** — the same items and handlers as `suggestions`, for the latest reply only. Hidden while `thinking`, when empty, and the moment the visitor sends (ChatDock hides them itself, before the app clears them). Choosing one calls `onSuggestionSelect`, then `onSend` with its `prompt`. Focus stays in the composer. The app decides which replies get follow-ups; **Pattern — chat dock** keeps the state: `ask` resolves with `string | { reply, followUps? }`, the pattern sets them on reply and clears them on send.
- **Placement: inline by default.** Two placements were built and compared with three follow-ups at 1280 and 390 (**Components/ChatDock → Follow-ups — …** stories):

  | Width | `inline` (rows under the reply) | `composer` (pills above the composer) |
  |-------|-------------------------------|---------------------------------------|
  | 1280 | 108px, in the thread | 96px pinned (two lines); the conversation loses 108px |
  | 390 | 132px (three 44px rows), in the thread | 148px pinned (three lines); the conversation loses 160px, before the keyboard opens |

  Inline reads as part of the answer, keeps a long label on one line, and costs no fixed height; because follow-ups belong only to the latest reply and the thread stays pinned to the end, scrolling with the thread is not a cost in practice. `followUpsPlacement="composer"` stays available for a long thread where the follow-ups must stay beside the field.
- Additive: the resting pills, the rows before the first message, and `suggestions` are unchanged.
- **No per-item icons.** Each follow-up drawing its own icon read as a second set of suggestions. Inline rows all lead with the same Lucide **CornerDownRight** (a reply to the answer above); pills above the composer are text only. A follow-up's `icon` is ignored.

### Amendment — 2026-10-04: reply actions and a score

The old full-page chat (the 0.2.0 Sites pattern, gone since 0.3.0) had Copy, thumbs up, and thumbs down under each reply; ChatDock had nowhere for them, so the site would have put buttons inside `messages[].content`. The site also wants to show how sure the assistant was of its match.

- **On a reply message:** `copyText?` shows Copy (ChatDock writes the clipboard and confirms), `meta?: { label, description? }` shows a short muted note such as "Match 99%" (`description` is read to screen readers), `feedback?: "up" | "down" | null` is the current vote. **On ChatDock:** `onMessageFeedback?(message, value)` shows the thumbs; pressing the active one sends `null`. Labels `copy`, `copied`, `helpful`, `notHelpful`.
- **WMDS owns the row** (where it sits, when it shows, how it looks). **The app owns** the score's text, what Copy copies, and what happens to a vote.
- **Shown** under finished replies only: not on the greeting or the visitor's turns, and not while the latest reply is still arriving (`thinking`). Where the pointer can hover, on hover or focus within the reply. **On touch screens the row is always shown under every finished reply.** The proposal offered "always on the latest reply" or "tap to reveal"; the first leaves older replies with no way to copy or vote on touch, and the second hides the actions behind a gesture nobody knows. Always showing costs a 44px row under each reply on a phone, which the short dock thread can afford.
- **The row always keeps its height**, so hover, focus, and a reply finishing never move the thread.
- **IconButton gains `pressed`** (the toggle pattern) for the thumbs: `aria-pressed`, the pressed fill, and a filled glyph. The selected fill used elsewhere (`bg-secondary`) matches the dark surface, so it could not show a vote there.
- **Pattern — chat dock** holds the votes and hands each one to a required `onFeedback`; `ask` resolves with `string | { reply, followUps?, meta?, copyText? }`, and `copyText` defaults to the reply text.
- Additive: messages without these fields, and docks without `onMessageFeedback`, render as before.

### Amendment — 2026-10-04: one composer, open and close

The first build swapped two elements: the resting bar left and a clipped window with its own composer appeared, so the composer vanished and reappeared somewhere else, and the clip cut off the card's shadow.

- **One composer in both states.** The **PromptBar** stays mounted and on screen every frame. The window is an opaque card behind it, always mounted, hidden once it has folded away.
- **From `md` the window grows out of the bar.** Its bottom edge stays on the bar's bottom edge; height, side insets (0 → 16px wider than the bar on each side), and radius (pill → shell) animate on the medium tier. The composer keeps its width and rises only by the disclaimer line that opens under it. The mark folds out of the composer; the header carries it.
- **Below `md` the window rises from the bottom edge** to full screen and falls back.
- **Choreography.** Opening: the window moves first, then the header, conversation, and rows fade in one `--motion-stagger` apart, a `--motion-beat` in. Closing: they fade first, and the window folds a stagger later. Hover pills leave as the window opens and return only after it has folded.
- **Interruptible.** Escape while opening, or a click in the composer while closing, animates back from where it is.
- **Reduced motion** crossfades the window in place at full size. Nothing slides (Motion makes size and position changes instant under reduced motion), so the mark and the disclaimer line switch at once and the composer steps up by that line.
- Props are unchanged.

### Amendment — 2026-10-04: a Start a project gate in the composer's place

The site has to run Start a project inside the chat, as the old full-page chat did, not as a dialog over it. ChatDock drew its own composer with nothing able to replace it, so the site opened a `Dialog`. This reverses the decision above that "the in-chat Start Project gate stays out of WMDS".

- **`gate?: ReactNode`.** While it is set and the window is open, it takes the composer's place; the suggestion rows, follow-ups, and disclaimer step aside; the conversation stays above. Setting it opens the window — closed or mid-conversation — and moves focus to the gate; clearing it brings the composer back with focus.
- **Where it sits, its size, and how it enters and leaves are WMDS's.** The composer and the gate share one cell and crossfade while the area eases between their heights. Both stay mounted while the gate is set, so closing the window keeps the gate and its progress for when it reopens. The gate hugs each step up to a cap — the window less its header, 7rem of conversation, and the space under it, never below 12rem — then its body scrolls.
- **Escape is the gate's.** **ChatDock.Gate** closes on Escape; ChatDock does not fold the window from under a gate. A second Escape, back at the composer, closes the window. The window's close still folds it.
- **The shell ships as a component, ChatDock.Gate**, not only as pattern Show code (the proposal had it as a pattern). It carries behavior — step motion, the body easing to each step's height, Escape, focus kept in the gate between steps — which this ADR keeps out of pasted code. The steps' content, validation, and what is sent stay the app's, in **Pattern — start a project gate**.
- **How it opens is the app's.** **Pattern — chat dock** holds `startProject` / `onStartProjectChange`: the Start a project suggestion, a site button, and an `ask` result with `startProject: { services?, budget? }` (opening it filled in) all set it; `renderStartProject` returns the gate. Finishing hands the conversation the answers as **ChatQa** and a confirmation line, and fires confetti.
- **Number keys:** **useKbdChoiceKeys** takes a `scope`, so digits act only while focus is in the gate, and no longer skip a focused checkbox or radio.
- **Phones:** the full-screen window and the composer or gate follow the visual viewport, so a keyboard does not cover them. Untested on a physical device at the time of writing.
- **Thumbs are per reply.** They show on replies that carry `feedback` (`null` before a vote), so a form's summary takes no vote. This narrows the reply-row amendment above, before its release.
- **The conversation takes focus** (`tabIndex=0` on the log), so a keyboard can scroll it when nothing inside is focusable — with a gate up it is often short.

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

### Amendment — 2026-10-05: the gate takes over the window

On the site the gate read as a card inside the chat: two headers and two closes, "Ask anything" over a form where nothing could be asked, the last reply alone above a gap, and a cap that kept that reply in view at the form's expense (at 900px tall, step 1 showed 5 of 7 services and scrolled). The intent of Start a project is focus. This reverses "the conversation stays above" from the amendment above.

- **While `gate` is set, the window is the form.** The gate fills the window: one header (the step's title and subtitle, previous, "2 of 4", next, close), the step in a body that takes the height left and scrolls, and the footer (start slot, Cancel, primary) on the window's bottom edge. No inner card: **ChatDock.Gate** is a flush, ghost **Card**; the window owns the surface. The window's header, the conversation, the composer, the suggestion rows, the follow-ups, and the disclaimer fade out and wait behind it, mounted, so finishing or cancelling brings the conversation back as it was, with the answers and the confirmation the pattern adds. The cap (`--chat-dock-gate-max`) is gone.
- **The one close folds the window and keeps the gate.** The gate's header close, Escape, and a click on the scrim all fold the window; the gate stays with its progress and is there when the visitor reopens the chat. Cancel is the one way to leave the form. Rationale: the header's close does what the window's close does everywhere, and none of the quick ways out throws away typed answers.
- **The fixed window is modal while the gate is up.** A scrim (`--color-overlay`) covers the page and **SiteNav**, everything outside the dock is `inert`, the page does not scroll, and Tab cycles inside the window (`aria-modal="true"`). Inline previews are not modal. Rationale: the form is a commitment the visitor chose; the page behind would only compete with it, and a live page behind a form with no scrim reads as a bug.
- **Sending is part of the gate.** **ChatDock.Gate** takes `pending` ("Sending…", controls off, `aria-busy`) and `error` (announced, over the footer); the header's next is off on the last step, so the footer's primary can be "Send" or "Try again". **Pattern — start a project gate**'s `onSubmit` returns a promise: the conversation thanks the visitor only once it resolves; a rejection keeps every answer and offers Try again.
- **Hydration.** ChatDock reads reduced motion through `useSyncExternalStore` with a server value of off, so the closed window's inline style is the same on the server and in the hydration render.

