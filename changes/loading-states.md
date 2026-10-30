---
bump: minor
---

**Loading states (Rule 21).**
- **`useDelayedLoading(loading, { delay, minDuration })`** (new, Y7): show an indicator only after 400ms, and keep it at least 400ms once shown. Input and TextArea use it for their spinner.
- **Input / TextArea `loading`** (Y4): the field carries `aria-busy`, and a status line says what's happening (new `loadingLabel`, default "Checking…").
- **Reduced motion** (Y6): every spinner holds still (Button, Input, TextArea, Checkbox, Switch, Status ring); the words carry the state.
- **400ms timing everywhere WMDS loads** (Y7): Checkbox, Switch and IconButton spinners, and the LinkTile, Stat and LogView skeletons wait 400ms (room kept at once) and stay at least 400ms. Busy state and blocking start immediately.
- **LinkTile `loading`** (Y4): busy with words for screen readers (new `loadingLabel`, default "Loading…"), no longer hidden.
- **Button loading look** (Y8): keeps the role's own fill (a primary stays primary) with the spinner; the grey fill read as disabled. Default labels are a send ("Sending…", "Sent", "Try again"), and Button warns when `status="loading"` has no `statusLabels.loading`.
- **Button `status`** (Y8): one width through idle, loading, success and error (no resize), so a "Sending…" label never moves the layout. Still `aria-live`, focusable, and repeat presses are ignored while loading. Docs: in forms, success hands over to the confirmation.

### Consumer actions

None required. Wrap your own loading indicators in `useDelayedLoading`. Give send buttons real `statusLabels` ("Sending…").
