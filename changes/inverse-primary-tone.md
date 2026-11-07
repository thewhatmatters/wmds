---
bump: patch
---
**Inverse bands: the primary inverts, so it no longer reads as disabled (gap 4).**

- **Band** `tone="inverse"`: the primary now inverts as it already did on `field`: the band's ink as the fill, the band colour as the label. Before, it kept the dark slate primary (#5a6d85), which sat at 2.98:1 on the navy and read as a disabled button. Measured on the default navy: fill #ffffff on the band 15.78:1, label #011272 on it 15.78:1, on hover (#e1e3ee) 12.34:1, on active (#ccd0e3) 10.29:1, focus ring 15.78:1; disabled (70%) #b3b8d5 with the label at 8.07:1. **Button** `primary`, and checked **Checkbox**, **Radio** and **Switch**, follow it.
- Fixed: on inverse bands the primary's hover and active were overridden by the dark theme's lift toward white (an inverse band also carries `data-theme="dark"`), so a light primary's hover matched its rest state. They now step toward the band on both tones (`stateColors.css`).
- **Brand kit** (new knobs): `--color-brand-surface-primary` / `--color-on-brand-surface-primary` keep a brand's own action colour on its inverse bands when it stands out there. `npx wmds-check` checks the pair (`brand-contrast`).
- New interaction test **on an inverse band the primary reads enabled: AA label, 3:1 fill, distinct states**.

### Consumer actions

- Look at any primary button or checked control on an inverse band: it is now light on the band colour. To keep your brand's action colour there instead, set `--color-brand-surface-primary` and `--color-on-brand-surface-primary` in `brand.css` (3:1 against the surface, 4.5:1 for the label).
