import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as pitchKitStyles from "./pitchKitStyles";

const storiesSource = readFileSync(
  join(import.meta.dirname, "PitchKit.stories.tsx"),
  "utf8",
);
const kitSource = readFileSync(
  join(import.meta.dirname, "PitchKitShareableExample.tsx"),
  "utf8",
);

const copySourceStart = storiesSource.indexOf(
  "export function PitchKitShareablePage",
);
const copySourceEnd = storiesSource.indexOf("export const GraphDataUnavailable");
const showCodeSource = storiesSource.slice(copySourceStart, copySourceEnd);

const kitStyleKeys = [
  ...kitSource.matchAll(/^\s+(pitchKit\w+Classes),?$/gm),
].map((match) => match[1]);

const shareableStyleKeys = kitStyleKeys.filter((key) =>
  key.startsWith("pitchKitShareable"),
);

describe("Pattern — shareable PitchKit Show code", () => {
  it("extracts the Pattern Show code snippet", () => {
    expect(copySourceStart).toBeGreaterThan(-1);
    expect(copySourceEnd).toBeGreaterThan(copySourceStart);
  });

  it("embeds the shared kit body and interpolates shareable style tokens", () => {
    expect(showCodeSource).toContain('shareableKitCopySource("posts")');
    expect(shareableStyleKeys.length).toBeGreaterThan(4);
    for (const key of shareableStyleKeys) {
      expect(storiesSource, key).toContain(`\${${key}}`);
      expect(
        pitchKitStyles[key as keyof typeof pitchKitStyles].length,
        key,
      ).toBeGreaterThan(0);
    }
  });

  it("keeps shareable spacing and type tokens on those styles", () => {
    expect(pitchKitStyles.pitchKitShareableStatClasses).toContain(
      "lg:col-span-6",
    );
    expect(pitchKitStyles.pitchKitShareableStatClasses).not.toContain("w-full");
    expect(pitchKitStyles.pitchKitShareablePostMetricsClasses).toContain(
      "grid-cols-2",
    );
    expect(pitchKitStyles.pitchKitShareableContactLineClasses).toContain(
      "type-body",
    );
    expect(pitchKitStyles.pitchKitShareableBrandNameClasses).toContain(
      "type-heading-4",
    );
  });

  it("freezes identity, verified stats, contact, and past-brand proof", () => {
    expect(storiesSource).toContain("Selected posts");
    expect(storiesSource).toContain("Past-brand proof");
    expect(storiesSource).toContain("Creator-entered.");
    expect(storiesSource).toContain("TextLink");
    expect(storiesSource).toContain('label="Followers"');
    expect(storiesSource).toContain('label="Engagement rate"');
    expect(storiesSource).toContain("{creator.handle}");
  });

  it("omits owner edit chrome and Storybook inspector from Show code", () => {
    expect(showCodeSource).not.toContain("MoreMenu");
    expect(showCodeSource).not.toContain("AlertDialog");
    expect(showCodeSource).not.toContain("ExampleGridControls");
    expect(showCodeSource).not.toContain("GridOverlay");
    expect(showCodeSource).not.toContain("Coming soon");
    expect(showCodeSource).not.toContain("Hide from kit");
  });
});
