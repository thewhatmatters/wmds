// @thewhatmatters/wmds@0.4.4 · Pattern — details
// Storybook: Components/DescriptionList → Pattern — details (?path=/story/components-descriptionlist--details)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { DescriptionList } from "@thewhatmatters/wmds";

export interface ProjectDetails {
  client: string;
  scope: string;
  timeline: string;
}

export function ProjectFacts({ project }: { project: ProjectDetails }) {
  return (
    <DescriptionList>
      <DescriptionList.Item name="Client">{project.client}</DescriptionList.Item>
      <DescriptionList.Item name="Scope">{project.scope}</DescriptionList.Item>
      <DescriptionList.Item name="Timeline">{project.timeline}</DescriptionList.Item>
    </DescriptionList>
  );
}
