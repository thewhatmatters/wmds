import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const entry = path.resolve(import.meta.dirname, "../../dist/index.js");

/**
 * The built package must load under plain Node ESM — what a node test runner does with the main
 * entry. CommonJS dependencies (`@rive-app/react-canvas`) expose only `default` there, so a named
 * import fails to link. Runs after `npm run build` (the build runs the same import itself).
 */
describe.skipIf(!existsSync(entry))("dist main entry in node", () => {
  it("imports without a DOM and exports the components", () => {
    const script = `const m = await import(${JSON.stringify(pathToFileURL(entry).href)});
console.log(JSON.stringify({ count: Object.keys(m).length, button: typeof m.Button, rive: typeof m.RiveHand, textArea: typeof m.TextArea }));`;
    const out = execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      encoding: "utf8",
    });
    const result = JSON.parse(out.trim().split("\n").pop() ?? "{}");
    expect(result.count).toBeGreaterThan(100);
    expect(result.button).not.toBe("undefined");
    expect(result.rive).not.toBe("undefined");
    expect(result.textArea).not.toBe("undefined");
  });
});
