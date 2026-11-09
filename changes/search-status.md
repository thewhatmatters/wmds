---
bump: patch
---
**Search: a one-field signup, with the button inside the field and a validation band.**

- **Search** `actionType="submit"`: the inset action becomes the form's submit button, so a click and Enter both send the form (a newsletter or waitlist signup). Default `button`, as before.
- **Search** `status` and `message`: the pill's border takes the status colour and the message opens in the band under it, as on **Input**. The field is marked invalid and described by the message, and keeps what was typed and its focus.
- **Input**: an inline field keeps an `aria-invalid` passed to it (Search sets it from its own `status`).
- New story: Search → Pattern — newsletter signup (wrap Search in **Field** for a visible label).

### Consumer actions

- None.
