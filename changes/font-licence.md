---
bump: patch
---
**Geist font licence ships with the fonts.**

- **Fonts**: the package now includes the SIL Open Font License 1.1 and the Geist copyright notice beside the bundled font files, as `dist/files/LICENSE-geist.txt` and `dist/files/LICENSE-geist-mono.txt`, taken from the installed `@fontsource-variable` packages. `npm run check:pack` fails if either is missing.
- **README**: a Licences section for the fonts, the Rive hand art and GSAP.

### Consumer actions

- None. Apps that copy the font files out of the package keep the matching licence file with them.
