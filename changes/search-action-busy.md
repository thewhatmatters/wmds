---
bump: patch
---
**Search: the inset action can show a send.**

- **Search**: new `actionStatus` (`idle`, `loading`, `success`, `error`) and `actionStatusLabels`. While `loading` the action shows a spinner beside your label ("Sending…"), is marked busy for screen readers, keeps the keyboard focus, and a second press or Enter doesn't send the form again. The action keeps its height in every state and holds one width for all four labels, so the field beside it doesn't move. On touch screens its tap area stays 44px or more. See **Components → Search → Pattern — newsletter signup**.

### Consumer actions

- None. If a signup built on **Search** guards against a double send in its own code, pass `actionStatus` as well, so people see that the send is under way. Pass `"idle"` at rest (not `undefined`): the button is then the same element before and during the send. Keep the labels short; the action is as wide as the longest one.
