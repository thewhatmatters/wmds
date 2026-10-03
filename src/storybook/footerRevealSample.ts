/**
 * Storybook-only sample content for **FooterReveal**. The components ship no content defaults;
 * stories, tests, and Show code pass this content explicitly.
 */
export const footerRevealRuledSample = {
  wordmark: "WhatMatters",
  mark: "WM",
  copyright: "WhatMatters © 2026",
  links: [
    { label: "Services", href: "/services" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
  ],
  email: "randy@whatmatters.so",
  credit: "Created by WhatMatters 2024–2026",
} as const;

export const footerRevealBrandSample = {
  headline: "We Build WhatMatters",
  ctaLabel: "Start a project",
  wordmark: "WHATMATTERS",
  socialLinks: [
    { label: "Contra", href: "#contra-TODO" },
    { label: "Instagram", href: "https://www.instagram.com/thewhatmatters" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/randymdaniel" },
    { label: "X", href: "#x-TODO" },
  ],
} as const;

/** The JSX Show code uses for the ruled footer — keep in step with `footerRevealRuledSample`. */
export const footerRevealRuledSampleJsx = `<FooterReveal.Ruled
  wordmark="WhatMatters"
  mark="WM"
  copyright="WhatMatters © 2026"
  links={[
    { label: "Services", href: "/services" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
  ]}
  email="randy@whatmatters.so"
  credit="Created by WhatMatters 2024–2026"
/>`;
