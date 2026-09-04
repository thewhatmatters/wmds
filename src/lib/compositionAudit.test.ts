import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  auditCompositionSources,
  formatCompositionAuditReport,
  shouldScanCompositionFile,
} from "./compositionAudit";

const REPO_ROOT = join(import.meta.dirname, "..", "..");
const COMPONENTS_ROOT = join(REPO_ROOT, "src", "components");

function walkComponentSources(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walkComponentSources(path, files);
      continue;
    }
    if (path.endsWith(".tsx") || path.endsWith(".ts")) {
      files.push(path);
    }
  }
  return files;
}

function loadMoleculeAndOrganismSources(): Record<string, string> {
  const sources: Record<string, string> = {};

  for (const tier of ["molecules", "organisms"] as const) {
    const tierDir = join(COMPONENTS_ROOT, tier);
    try {
      statSync(tierDir);
    } catch {
      continue;
    }

    for (const absolutePath of walkComponentSources(tierDir)) {
      const relativePath = relative(join(REPO_ROOT, "src"), absolutePath).replace(/\\/g, "/");
      if (!shouldScanCompositionFile(relativePath)) {
        continue;
      }
      sources[relativePath] = readFileSync(absolutePath, "utf8");
    }
  }

  return sources;
}

describe("compositionAudit", () => {
  it("passes for shipped molecules and organisms (no unresolved composition gaps)", () => {
    const sources = loadMoleculeAndOrganismSources();
    const report = auditCompositionSources(sources);

    expect(report.scannedFiles.length, "expected at least one molecule component file").toBeGreaterThan(0);
    expect(report.unresolved, formatCompositionAuditReport(report)).toEqual([]);
  });
});
