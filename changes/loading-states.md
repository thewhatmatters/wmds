---
bump: minor
---

**Loading states (Rule 21).**
- **`useDelayedLoading(loading, { delay, minDuration })`** (new, Y7): show an indicator only after 400ms, and keep it at least 400ms once shown. Input and TextArea use it for their spinner.
- **Input / TextArea `loading`** (Y4): the field carries `aria-busy`, and a status line says what's happening (new `loadingLabel`, default "Checking…").
- **Reduced motion** (Y6): every spinner holds still (Button, Input, TextArea, Checkbox, Switch, Status ring); the words carry the state.
- **Button `status`** (Y8): one width through idle, loading, success and error (no resize), so a "Sending…" label never moves the layout. Still `aria-live`, focusable, and repeat presses are ignored while loading. Docs: in forms, success hands over to the confirmation.

### Consumer actions

None required. Wrap your own loading indicators in `useDelayedLoading`. Give send buttons real `statusLabels` ("Sending…").
