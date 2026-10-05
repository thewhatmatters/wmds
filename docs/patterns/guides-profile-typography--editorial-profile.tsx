// @thewhatmatters/wmds@0.4.5 · Pattern — editorial profile
// Storybook: Guides/Profile typography → Pattern — editorial profile (?path=/story/guides-profile-typography--editorial-profile)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import {
  Avatar,
  Button,
  ButtonIcon,
  DisplayControls,
  GridOverlay,
  TextLink,
  type DisplayControlThemeMode,
} from "@thewhatmatters/wmds";
import { ChevronRight, VolumeX } from "lucide-react";

export function ProfilePage({ onOpenRole }: { onOpenRole: (company: string) => void }) {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");

  return (
    <main
      data-theme={theme === "auto" ? undefined : theme}
      className="grid-page min-h-screen bg-body py-12 [--grid-column-gap:24px] [--grid-max:960px] sm:py-16 lg:py-20"
    >
      <GridOverlay
        visible={gridVisible}
        onVisibleChange={setGridVisible}
        keyboardShortcut={false}
      />

      <div className="band">
        <article className="col-span-full max-w-[52rem] sm:col-start-2 sm:col-span-6 lg:col-start-2 lg:col-span-10">
          <header className="flex flex-col items-start gap-4">
            <Avatar name="Avery Kim" size="lg" />
            <div>
              <h1 className="type-heading-1 text-fg tracking-tight">Howdy, I’m Avery.</h1>
              <p className="type-body text-muted">You can call me “Ave.”</p>
            </div>
          </header>

          <div className="mt-8 flex flex-col gap-5 sm:mt-10">
            <p className="type-body text-fg">
              Currently building at <TextLink href="#work">WhatMatters</TextLink>.
            </p>
          </div>

          <section id="work" className="mt-12 sm:mt-14">
            <h2 className="type-body text-muted">Work</h2>
            <ul className="mt-4 border-t border-border">
              <li className="border-b border-border py-2">
                <Button role="ghost" layout="row" onClick={() => onOpenRole("WhatMatters")}>
                  <span className="flex items-center gap-3">
                    <Avatar name="WhatMatters" size="xsm" />
                    <span>WhatMatters</span>
                  </span>
                  <ButtonIcon size="sm"><ChevronRight /></ButtonIcon>
                </Button>
              </li>
            </ul>
          </section>

          <footer className="mt-12 flex flex-col gap-5 sm:mt-14">
            <p className="type-body text-fg">
              Read my <TextLink href="/writing">writing</TextLink>.
            </p>
            <Button role="ghost" size="xs" icon={<VolumeX />}>Sound off</Button>
          </footer>
        </article>
      </div>

      <DisplayControls
        className="fixed bottom-4 right-4 z-20"
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
      />
    </main>
  );
}
