---
bump: patch
---

**SiteNav hydrates cleanly under reduced motion; Accordion rows can be headings**

- **SiteNav**: a compact bar on the first render (`state="compact"`) no longer causes a hydration mismatch for readers with reduced motion on. Its starting style is now the same on the server and in the browser; reduced motion still gets no slide.
- **Accordion** `headingLevel` (`2`–`6`): wraps each expandable row's button in a heading (`<h3><button aria-expanded>…</button></h3>`), so screen-reader users can move between rows by heading. Nothing changes to the eye. Off by default.

### Consumer actions

- For an FAQ or any accordion that is page content, set `headingLevel` one level below the section's heading: `<Accordion headingLevel={3}>`. Leave it out in app UI (filters, task rows).
