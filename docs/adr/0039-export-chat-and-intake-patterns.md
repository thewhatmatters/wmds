# ADR-0039: Export the chat and intake patterns as components

**Status:** Proposed — awaiting review by Randy. Nothing in this ADR is built yet.
**Date:** 2026-10-03
**Amends:** ADR-0004 (Pattern-first — not utility-first), rule 4 “Examples are templates”.

## Context

ADR-0004 makes Storybook **Pattern** stories the contract and has apps paste their Show code. That works for compositions: a page layout, a settings card, a header. It fails for patterns that carry behavior.

- **Prompt chat → landing to chat** is about 900 lines of Show code: a scroll stage that sticks to the end, a composer whose measured height pads the thread, a scripted thinking trace, a word-by-word streamed reply, hover-revealed actions, follow-ups, and the in-thread Start Project gate. The WhatMatters site pasted it as `components/ask-what-matters.tsx` (974 lines) and it has drifted since. Every WMDS fix — the strict-TypeScript pass, the Button overrides, the motion tokens — has to be re-pasted and re-merged by hand.
- The **Start Project gate** duplicates the intake flow's state machine (`IntakeStep`, `IntakePhase`, `canContinueIntake`) inside that paste.
- The **marketing composer** (PromptBar pinned to the bottom of the homepage, handing off to the ask page) was hand-rolled on the site until it became **Components/PromptBar → Pattern — marketing composer**, which is itself a paste.

Pasting is right when the app owns the structure. It is wrong when WMDS owns the behavior: then each paste is a fork.

## Decision (proposed)

### Amendment to ADR-0004

Rule 4 becomes:

> **4. Patterns are templates until they carry behavior.** A Pattern whose Show code owns state machines, timers, measurement, scroll management, or choreography is exported as a component. Content, options, copy, data, and submit handlers are props; the app owns them. Its Pattern story's Show code shrinks to the short usage snippet. Compositions without behavior stay paste-only.

Signals that a pattern carries behavior: more than ~150 lines of Show code; `useEffect` / `useLayoutEffect`; `ResizeObserver`, timers, or scroll listeners; a state machine shared with another pattern; more than one app pasting it.

### What gets exported

Four exports, all organisms except the composer (molecule). Content and data are always props. No component fetches, routes, or calls a model.

#### 1. `ChatThread` — the conversation

Compound, controlled. The app owns the turns and the stream; WMDS owns layout, the trace, the reveal choreography, actions, and follow-ups.

```tsx
<ChatThread aria-label="Conversation" onReplyGrown={() => {}}>
  {turns.map((turn) => (
    <ChatThread.Turn key={turn.id}>
      <ChatThread.UserMessage>{turn.prompt}</ChatThread.UserMessage>

      <ChatThread.Trace
        status={turn.status === "thinking" ? "thinking" : "done"}
        steps={turn.steps}                 // string[] — revealed one per motion beat while thinking
        elapsedSeconds={turn.elapsed}      // drives "Thought for Ns"
        defaultOpen={false}
        hideWhenReplying                   // the steps pattern removes the row once the reply starts
        labels={{ thinking: "Thinking", thought: (s) => `Thought for ${s}s` }}
      />

      <ChatThread.Reply
        parts={turn.parts}                 // ({ kind: "word"; text } | { kind: "source"; text; href })[]
        streaming={turn.status === "streaming"}
        onStreamEnd={() => markDone(turn.id)}
      />

      <ChatThread.ReplyActions
        onCopy={() => copy(turn)}
        feedback={turn.feedback}           // "up" | "down" | null
        onFeedbackChange={(mark) => rate(turn.id, mark)}
        labels={{ copy: "Copy", up: "Good response", down: "Bad response" }}
      />

      <ChatThread.FollowUps items={turn.followUps} onSelect={(item) => send(item)} />
    </ChatThread.Turn>
  ))}
</ChatThread>
```

- `ChatThread.Reply` reveals words with `motionStaggerSeconds()` and `motionBlurReveal()`, and holds on sources for `readMotionDurationSeconds("fast")`. If the app streams real tokens, it appends to `parts` and leaves `streaming` true; the reveal follows the data.
- Reduced motion renders the finished trace and reply, as the pattern does today.
- `ChatThread.FollowUps` renders **Button** `role="outline"` `emphasis="quiet"` `align="start"`.
- Intake answers render through the existing **ChatQa** inside a `ChatThread.Turn`.

#### 2. `ChatPage` — the page shell

Owns the 100svh column, the narrowed grid (`--grid-max`), the scrolling stage, the pinned composer, the composer-height padding, stick-to-end scrolling, and the landing-to-thread transition.

```tsx
<ChatPage
  header={<SiteNav … />}                     // optional; shown once chatting
  landing={<ChatPage.Landing headline="What should we make?" />}
  chatting={turns.length > 0}
  composer={<PromptBar value={draft} onValueChange={setDraft} onSend={send} />}
  gridMax="40rem"
  stickToEnd                                  // default true; pauses while the user scrolls up
>
  <ChatThread …/>
</ChatPage>
```

- `composer` can be swapped for the Start Project gate (below) without unmounting the thread, as today.
- `ChatPage.Landing` animates the headline out on the first send (medium tier); `initialPrompt` hand-off from the marketing composer starts with `chatting` already true.

#### 3. `StartProjectGate` — the in-thread intake card

Replaces the composer while open. Reuses the intake state machine instead of copying it: **IntakeModal**'s flow and this gate share one `useIntakeFlow()` hook (exported).

```tsx
<StartProjectGate
  step={flow.step}                            // 1 | 2 | 3 | 4, controlled
  onStepChange={flow.setStep}
  values={flow.values}                        // { needs: string[]; budget: string | null; about: IntakeAboutValues }
  onValuesChange={flow.setValues}
  needOptions={needs}                         // { value; label; description? }[]
  budgetOptions={budgets}                     // { value; label; emphasis? }[]
  copy={{ 1: { title, subtitle }, 2: …, 3: …, 4: … }}
  calendar={<Cal … />}                        // CalEmbed children; empty state when omitted
  onCancel={closeGate}
  onComplete={(outcome) => {                  // "booked" | "emailed"
    appendIntakeTurn(flow.values, outcome);
    submitLead(flow.values);                   // the app's request
  }}
/>
```

- Numbered choice keys (`useKbdChoiceKeys`), validation (`isIntakeAboutValid`), and Back / Next live inside.
- `useIntakeFlow({ initialValues })` returns `{ step, setStep, values, setValues, canContinue, reset }` and also drives **IntakeModal** pages.

#### 4. `MarketingComposer` — the homepage prompt

```tsx
<MarketingComposer
  onHandOff={(prompt) => router.push(`/ask?q=${encodeURIComponent(prompt)}`)}
  placeholder="Ask anything…"
  gridMax="40rem"
  hideWhenFooterVisible                       // optional: hides over FooterReveal's footer
/>
```

- Pinned to the bottom of the viewport on the page grid, above the safe area, under **SiteNav** (`z-50`); pointer events only on the bar.
- Composes **PromptBar**; no new Button role or color.

### Names and placement

| Export | Tier | Storybook | Replaces |
|--------|------|-----------|----------|
| `ChatThread` (+ `.Turn`, `.UserMessage`, `.Trace`, `.Reply`, `.ReplyActions`, `.FollowUps`) | Organism | Components/ChatThread | Thread half of **Pattern — landing to chat** |
| `ChatPage` (+ `.Landing`) | Organism | Components/ChatPage | Shell half of **Pattern — landing to chat** |
| `StartProjectGate`, `useIntakeFlow` | Organism + hook | Components/StartProjectGate | In-thread gate; IntakeModal page state |
| `MarketingComposer` | Molecule | Components/PromptBar/MarketingComposer (family) | **Pattern — marketing composer** |

`ChatQa` stays; it is the intake answers inside a turn. **Sites/WhatMatters/Prompt chat → Pattern — landing to chat** remains as the composed page, and its Show code becomes about 60 lines of usage.

## Consequences

- The site deletes `components/ask-what-matters.tsx` and imports four components. Upgrades fix the chat with `npm install`, not a re-paste.
- WMDS owns more behavior and must test it: interaction stories for streaming, stick-to-end, gate steps, and reduced motion move from the Sites page to the component stories.
- The scripted trace and sample reply become Storybook fixtures, not shipped code.
- The bundle grows only for apps that import these (one module per file).
- Show code for these patterns becomes short and stable, so the consumer check (`check:show-code`) gets cheaper.

## Open questions for review

1. **Scope:** export all four, or start with `ChatThread` + `ChatPage` and keep the gate and composer as patterns for one more release?
2. **Streaming contract:** is `parts` (word / source list) right for the real backend, or should `ChatThread.Reply` take markdown text and tokenize it?
3. **Trace content:** are the trace steps app data (the model's real steps), or a fixed WhatMatters script?
4. **Generic vs WhatMatters:** `ChatThread` / `ChatPage` read as generic WMDS components; `StartProjectGate` is WhatMatters-specific. Keep it in WMDS, or in a WhatMatters-site layer?
5. **Labels and i18n:** props with English defaults (as `CalEmbed` does), or required labels?
6. **Analytics:** add `onEvent` hooks (send, follow-up, copy, feedback, gate step), or leave tracking to the app's handlers?

## Related

- ADR-0004 — pattern-first (amended here)
- ADR-0006 — input architecture (PromptBar, IntakeForm)
- ADR-0008 — motion tiers; the choreography tokens added for Show code
- ADR-0026 — Storybook catalog (component titles and the PromptBar family)
- ADR-0038 — intake modal (shared intake flow)
