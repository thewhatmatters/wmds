---
bump: patch
---
**SkipLink: "Skip to content" for pages without AppShell.**

- **SkipLink** (new): the first Tab stop on a page, hidden until it has the focus, then pinned over the top-start corner above a fixed **SiteNav**. Pressing it moves the focus into `main` (or the region named by `target`) without writing a hash into the URL; a region that can't take the focus gets `tabindex="-1"`. `children` changes the words ("Skip to results"). See **Components → SkipLink → Pattern — page frame**.
- **AppShell:** its skip link is now this component. Shown, it is 44px tall (was 36px) and sits above toasts.

### Consumer actions

- None. If a page carries a hand-built skip link, replace it with **SkipLink** and give the page's `main` `id="main"`.
