import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

/**
 * The site's chrome says WMDS, not Storybook: brand name, link and tab title.
 * Head tags (favicon, description, link previews) are in manager-head.html.
 */
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "WMDS · WhatMatters Design System",
    brandUrl: "https://github.com/thewhatmatters/wmds",
    brandTarget: "_blank",
  }),
});

// Storybook titles each tab "<page> ⋅ Storybook"; keep the page and name the site instead.
const brandTitle = () => {
  const next = document.title.replace(/ ⋅ Storybook$/, " · WMDS");
  if (next !== document.title) document.title = next;
};
new MutationObserver(brandTitle).observe(document.head, { subtree: true, childList: true, characterData: true });
brandTitle();
