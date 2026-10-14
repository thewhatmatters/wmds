// @vitest-environment happy-dom
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const entry = path.resolve(import.meta.dirname, "../../dist/index.js");

/** The same import a consuming app's vitest + DOM environment performs. Runs after `npm run build`. */
describe.skipIf(!existsSync(entry))("dist main entry in a DOM test environment", () => {
  it("imports and exports the components", async () => {
    const m = await import("../../dist/index.js");
    expect(Object.keys(m).length).toBeGreaterThan(100);
    expect(m.RiveHand).toBeDefined();
  });
});
