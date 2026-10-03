// @thewhatmatters/wmds@0.2.0 · Pattern — gallery intro
// Storybook: Components/ScrollHorizontal → Pattern — gallery intro (?path=/story/components-scrollhorizontal--with-intro)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { RiveHand, ScrollHorizontal, TextSequence } from "@thewhatmatters/wmds";

// Opens the multi-step project form. There is no /start route.
function openProjectModal() {}

const projects = [
  { id: "project-one", label: "Project One", color: "var(--color-brand)" },
  { id: "project-two", label: "Project Two", color: "var(--color-brand-soft)" },
  { id: "project-three", label: "Project Three", color: "var(--color-primary)" },
  { id: "project-four", label: "Project Four", color: "var(--color-info-muted)" },
  { id: "project-five", label: "Project Five", color: "var(--color-accent)" },
];

export function ProjectGalleryIntro() {
  return (
    <ScrollHorizontal
      items={projects}
      expandLast
      intro={
        <ScrollHorizontal.Intro
          eyebrow="SELECTED WORK"
          statement={
  <>
    {"Every screen"}
    <TextSequence.Shape variant="asterisk" />
    {" is a first impression "}
    <RiveHand hand="point" inline idle entrance="none" aria-hidden />
    {" and we make yours"}
    <TextSequence.Shape variant="diamond" tone="accent" />
    {" the one they remember."}
  </>
}
          action={{ label: "Start a project", onClick: openProjectModal }}
        />
      }
    />
  );
}
