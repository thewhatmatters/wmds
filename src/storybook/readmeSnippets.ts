/**
 * Start here shows the README's own install command and quickstart, read from README.md at build
 * time, so the site and the npm page can never disagree.
 */
export type ReadmeSnippets = { pitch: string; install: string; quickstart: string };

/** The first fenced code block under a `## Heading`, and the prose between it and the next heading. */
export function readmeSection(readme: string, heading: string): string {
  const start = readme.indexOf(`\n## ${heading}\n`);
  if (start === -1) throw new Error(`README.md has no "## ${heading}" section`);
  const body = readme.slice(start + heading.length + 5).split(/\n## /)[0];
  const match = body.match(/```[a-z]*\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`README.md "## ${heading}" has no code block`);
  return match[1];
}

/** The bold one-line pitch under the README title. */
export function readmePitch(readme: string): string {
  const match = readme.match(/^# [^\n]+\n+\*\*(.+?)\*\*/);
  if (!match) throw new Error("README.md has no bold pitch line under its title");
  return match[1];
}

export function readmeSnippets(readme: string): ReadmeSnippets {
  return {
    pitch: readmePitch(readme),
    install: readmeSection(readme, "Install"),
    quickstart: readmeSection(readme, "Quickstart"),
  };
}
