import { useEffect, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRight, VolumeX } from "lucide-react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Button } from "../../components/atoms/Button/Button";
import { ButtonIcon } from "../../components/atoms/Button/ButtonIcon";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { GridOverlay } from "../../lib/GridOverlay";
import { storyCopySource, storyMetaDocsDefaults } from "../../lib/storyCopySource";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";
import {
  profileAliasClasses,
  profileArticleClasses,
  profileFooterClasses,
  profileIdentityClasses,
  profilePageClasses,
  profileParagraphClasses,
  profileProseClasses,
  profileSectionClasses,
  profileSectionLabelClasses,
  profileTitleClasses,
  profileWorkCopyClasses,
  profileWorkDatesClasses,
  profileWorkItemClasses,
  profileWorkListClasses,
  profileWorkStartClasses,
  profileWorkTitleClasses,
} from "./profileTypographyStyles";

const meta = {
  title: "Examples/Profile typography",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

A quiet editorial profile page composed on a 960px WMDS **grid-page** with **TextLink**, **Avatar**, and **Button** rows. A development-only control cluster composes **DisplayControls** + **Panel** + **Input** so the wrapper width and column gap can be tuned live.

The constrained measure and section spacing do most of the work. **Page heading** establishes identity, **body** carries the narrative, **caption** handles dates, and **UI label** keeps work rows scannable.

## Anatomy

\`\`\`
grid-page + band
└── article — constrained reading measure
    ├── Avatar + page heading + muted alias
    ├── body prose + inline links
    ├── Work
    │   └── Button layout="row" + Avatar + caption
    └── contact prose + quiet sound action
ExampleGridControls — Storybook-only
├── DisplayControls — grid + theme
└── Panel — live wrapper width + column gap inputs
\`\`\`

## Best practices

- **Do** constrain long-form copy to a readable measure.
- **Do** use whitespace and semantic type roles before adding containers.
- **Do** reserve muted color for aliases, dates, and supporting actions.
- **Do** keep the layout panel in Storybook development surfaces only.
- **Don't** wrap every section in a Card.
- **Don't** use display type when the page should feel personal and conversational.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function WorkRow({
  company,
  dates,
}: {
  company: string;
  dates: string;
}) {
  return (
    <li className={profileWorkItemClasses}>
      <Button
        role="ghost"
        layout="row"
        aria-label={`View ${company} role`}
        onClick={() => undefined}
      >
        <span className={profileWorkStartClasses}>
          <Avatar name={company} size="xsm" />
          <span className={profileWorkCopyClasses}>
            <span className={profileWorkTitleClasses}>{company}</span>
            <span className={profileWorkDatesClasses}>{dates}</span>
          </span>
        </span>
        <ButtonIcon size="sm">
          <ChevronRight />
        </ButtonIcon>
      </Button>
    </li>
  );
}

function EditorialProfilePage() {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(960);
  const [columnGap, setColumnGap] = useState(24);

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");

    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }

    return () => {
      if (previousTheme == null) {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", previousTheme);
      }
    };
  }, [theme]);

  return (
    <main
      data-theme={theme === "auto" ? undefined : theme}
      className={profilePageClasses}
      style={
        {
          "--grid-max": `${gridMax}px`,
          "--grid-column-gap": `${columnGap}px`,
        } as CSSProperties
      }
    >
      <GridOverlay
        visible={gridVisible}
        onVisibleChange={setGridVisible}
        keyboardShortcut={false}
      />
      <div className="band">
        <article className={profileArticleClasses}>
          <header className={profileIdentityClasses}>
            <Avatar name="Avery Kim" size="lg" />
            <div>
              <h1 className={profileTitleClasses}>Howdy, I’m Avery.</h1>
              <p className={profileAliasClasses}>You can call me “Ave.”</p>
            </div>
          </header>

          <div className={profileProseClasses}>
            <p className={profileParagraphClasses}>
              I’m a product engineer interested in thoughtful software, useful
              tools, and making complex systems feel calm. I enjoy visualizing
              problems and writing code to solve them.
            </p>
            <p className={profileParagraphClasses}>
              Currently building at <TextLink href="#work">WhatMatters</TextLink>.
              Previously helped small teams turn dense workflows into clear,
              durable product experiences.
            </p>
          </div>

          <section id="work" className={profileSectionClasses}>
            <h2 className={profileSectionLabelClasses}>Work</h2>
            <ul className={profileWorkListClasses}>
              <WorkRow company="WhatMatters" dates="2024 – Present" />
              <WorkRow company="Civic Studio" dates="2021 – 2024" />
            </ul>
          </section>

          <footer className={profileFooterClasses}>
            <p className={profileParagraphClasses}>
              Read my <TextLink href="#writing">writing</TextLink>, or browse
              the <TextLink href="#projects">projects</TextLink> I’ve built.
              Want to discuss a project or just say hi?{" "}
              <TextLink href="#contact">Let’s grab a coffee</TextLink>.
            </p>
            <p className={profileParagraphClasses}>
              You can find me on{" "}
              <TextLink href="https://github.com/" external>
                GitHub
              </TextLink>{" "}
              and{" "}
              <TextLink href="https://instagram.com/" external>
                Instagram
              </TextLink>, or reach me via <TextLink href="#contact">email</TextLink>.
            </p>
            <Button role="ghost" size="xs" icon={<VolumeX />} className="self-start">
              Sound off
            </Button>
          </footer>
        </article>
      </div>

      <ExampleGridControls
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
        maxWidth={gridMax}
        onMaxWidthChange={setGridMax}
        columnGap={columnGap}
        onColumnGapChange={setColumnGap}
      />
    </main>
  );
}

export const EditorialProfile: Story = {
  name: "Pattern — editorial profile",
  render: () => <EditorialProfilePage />,
  parameters: {
    docs: {
      description: {
        story:
          "Open Layout to change the 960px wrapper or 24px column gap live. Press G for grid guides and T to cycle the theme. Show code omits the Storybook-only inspector harness.",
      },
    },
    ...storyCopySource(`
import { useState } from "react";
import {
  Avatar,
  Button,
  ButtonIcon,
  DisplayControls,
  GridOverlay,
  TextLink,
  type DisplayControlThemeMode,
} from "@whatmatters/wmds";
import { ChevronRight, VolumeX } from "lucide-react";

export function ProfilePage() {
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
                <Button role="ghost" layout="row" onClick={() => openRole("WhatMatters")}>
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
`),
  },
};
