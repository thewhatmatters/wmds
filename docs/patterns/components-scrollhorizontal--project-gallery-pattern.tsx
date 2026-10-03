// @thewhatmatters/wmds@0.2.0 · Pattern — project gallery
// Storybook: Components/ScrollHorizontal → Pattern — project gallery (?path=/story/components-scrollhorizontal--project-gallery-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { ScrollHorizontal } from "@thewhatmatters/wmds";

const projects = [
  { id: "project-one", label: "Project One", color: "var(--color-brand)" },
  { id: "project-two", label: "Project Two", color: "var(--color-brand-soft)" },
  { id: "project-three", label: "Project Three", color: "var(--color-primary)" },
  { id: "project-four", label: "Project Four", color: "var(--color-info-muted)" },
  { id: "project-five", label: "Project Five", color: "var(--color-accent)" },
];

export function ProjectGallery() {
  return (
    <ScrollHorizontal
      items={projects}
      heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
    />
  );
}
