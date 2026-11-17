---
bump: patch
---
**Shipped patterns pass `wmds-check`: TextLink `tone="brand"`, a 4rem type step, and a test over every pattern.**

- **TextLink**: new prop `tone`. `"default"` is unchanged. `"brand"` sets the link in the brand ink (`--color-brand`) in either variant, with the same underline and focus ring; a prose link's underline takes the brand ink on hover. For large links (24px and up): the dark theme's brand ink is 3.58:1 on the page. New exports `textLinkTones` and `TextLinkTone`.
- **Type scale**: new step `--font-size-7xl` (4rem, 64px) for large nav and footer links. Use it as `text-[length:var(--font-size-7xl)]`.
- **Components/FooterReveal → Pattern — ruled grid footer**: the nav links use `tone="brand"` and the new step, in place of `!text-brand` and `md:text-[4rem]`. They look the same, except the hover underline is now the brand ink. In the dark theme it was near-white on the footer's white surface, so it didn't show.
- **Components/TextLink → Pattern — brand nav links** (new).
- **wmds-check**: `status-without-message` no longer flags `Badge` or `Button`, whose `status` carries its own label. A sample document in **Card → Pattern — terminal frame** is marked with `wmds-check-ignore`.
- A unit test now runs `wmds-check` over every file in `docs/patterns`, so a pattern that breaks a rule fails CI. Three `raw-type` warnings in **Accordion → Pattern — FAQ reading** are listed as known; any new warning fails the test.

### Consumer actions

- Apps that pasted **Pattern — ruled grid footer**: re-copy it, or replace `className="!text-brand"` on its links with `tone="brand"` and `md:text-[4rem]` with `md:text-[length:var(--font-size-7xl)]`. Nothing changes for other uses of **TextLink**.
