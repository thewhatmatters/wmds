import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const script = path.resolve(__dirname, "../../bin/wmds-check.mjs");
const app = mkdtempSync(path.join(tmpdir(), "wmds-check-"));

interface Finding {
  file: string;
  line: number;
  rule: string;
  severity: "error" | "warn";
}

function check(files: Record<string, string>, extra: string[] = []) {
  rmSync(path.join(app, "src"), { recursive: true, force: true });
  for (const [name, source] of Object.entries(files)) {
    const file = path.join(app, "src", name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, source);
  }
  let stdout: string;
  let status = 0;
  try {
    stdout = execFileSync("node", [script, "--json", ...extra], { cwd: app, encoding: "utf8" });
  } catch (error) {
    const failed = error as { stdout: string; status: number };
    stdout = failed.stdout;
    status = failed.status;
  }
  const report = JSON.parse(stdout) as { findings: Finding[]; errors: number; warnings: number };
  return { ...report, status, rules: report.findings.map((finding) => finding.rule) };
}

afterAll(() => rmSync(app, { recursive: true, force: true }));
writeFileSync(path.join(app, "package.json"), '{ "name": "app", "private": true }');

describe("wmds-check", () => {
  it("passes WMDS components with layout-only className", () => {
    const result = check({
      "page.tsx": `import { Button } from "@thewhatmatters/wmds";
export function Page() {
  return <main className="grid-page"><Button role="primary" className="mt-4 w-full">Go</Button></main>;
}`,
    });
    expect(result.findings).toEqual([]);
    expect(result.status).toBe(0);
  });

  it("flags raw controls, ! overrides, and raw colors as errors", () => {
    const result = check({
      "bad.tsx": `import { Button } from "@thewhatmatters/wmds";
export function Bad() {
  return (
    <div style={{ color: "#ff0000" }}>
      <button type="button">Raw</button>
      <Button role="ghost" layout="row" className="!w-auto !gap-1.5">Row</Button>
      <input type="hidden" name="token" />
    </div>
  );
}`,
    });
    expect(result.rules).toEqual(expect.arrayContaining(["raw-control", "important-override", "raw-color"]));
    expect(result.findings.filter((finding) => finding.rule === "raw-control")).toHaveLength(1);
    expect(result.status).toBe(1);
  });

  it("warns on raw type and motion values, and fails past --max-warnings", () => {
    const files = {
      "copy.tsx": `export function Copy() {
  return <p className="text-sm duration-[300ms]">Hello</p>;
}`,
    };
    const lenient = check(files);
    expect(lenient.rules).toEqual(["raw-type", "raw-motion"]);
    expect(lenient.status).toBe(0);
    expect(check(files, ["--max-warnings", "0"]).status).toBe(1);
  });

  it("honors wmds-check-ignore comments", () => {
    const result = check({
      "ignored.tsx": `export function Upload() {
  // wmds-check-ignore raw-control native file picker until WMDS ships FileInput
  return <input type="file" />;
}`,
    });
    expect(result.findings).toEqual([]);
  });
});
