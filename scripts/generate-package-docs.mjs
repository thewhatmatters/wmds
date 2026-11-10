/**
 * Generates the agent docs that ship in the package under docs/:
 *
 * - docs/patterns/<story-id>.tsx — every story's Show code (the same string `storyCopySource()` /
 *   `withStoryCopySource()` gives Storybook), with a header naming the pattern and version.
 * - docs/patterns/index.json — one row per pattern file.
 * - docs/exports.json — the export manifest from src/package.manifest.ts, with each component's
 *   category, summary, Storybook page, and patterns.
 * - docs/components.md — the consumer-facing component and token contracts from AGENTS.md → Storybook-first.
 *
 * And, at the repository root (not shipped in the package):
 *
 * - registry.json — a shadcn-style registry: one `registry:block` per pattern, depending on the package.
 *
 * `node scripts/generate-package-docs.mjs` writes the files.
 * `node scripts/generate-package-docs.mjs --check` writes nothing and fails when a committed file
 * differs from what Storybook would produce today (CI).
 */
import { existsSync, globSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(root, "docs");
const patternsDir = path.join(docsDir, "patterns");
const check = process.argv.includes("--check");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

/**
 * Stories are loaded in Node only to read their parameters. Rive's CommonJS build does not load
 * there, and nothing renders, so RiveHand's imports resolve to inert stand-ins.
 */
const riveStub = {
  name: "wmds-docs-rive-stub",
  enforce: "pre",
  resolveId(id) {
    return id === "@rive-app/react-canvas" ? "\0rive-stub" : null;
  },
  load(id) {
    if (id !== "\0rive-stub") return null;
    return [
      "const noop = () => ({});",
      "export const Fit = {}; export const Layout = class {}; export const RuntimeLoader = { setWasmUrl() {} };",
      "export const Rive = { suppressDeprecationWarnings: [] };",
      "export const useRive = noop; export const useStateMachineInput = () => null;",
      "export const useViewModelInstanceColor = () => ({});",
    ].join("\n");
  },
};

const server = await createServer({
  root,
  configFile: false,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
  plugins: [riveStub],
  // Without this, SSR hands the bare import to Node before the stub plugin can resolve it.
  ssr: { noExternal: ["@rive-app/react-canvas"] },
});

const outputs = new Map();
try {
  const { toId, storyNameFromExport } = await import("storybook/internal/csf");
  const { packageManifest } = await server.ssrLoadModule("/src/package.manifest.ts");
  const { componentCatalog } = await server.ssrLoadModule("/src/storybook/componentCatalog.ts");

  // ── Patterns ────────────────────────────────────────────────────────────
  const patterns = [];
  const storyFiles = globSync("src/**/*.stories.tsx", { cwd: root }).sort();
  for (const file of storyFiles) {
    const mod = await server.ssrLoadModule(`/${file}`);
    const title = mod.default?.title;
    if (!title || title.startsWith("Internal/")) continue;
    for (const [exportName, story] of Object.entries(mod)) {
      if (exportName === "default" || exportName === "__namedExportsOrder" || !story || typeof story !== "object") continue;
      const source = story.parameters?.docs?.source;
      if (!source?.code || source.disable !== false) continue;
      const id = toId(title, storyNameFromExport(exportName));
      const name = story.name ?? storyNameFromExport(exportName);
      patterns.push({ id, title, name, file: `patterns/${id}.tsx`, source: file, code: source.code.trim() });
    }
  }
  patterns.sort((a, b) => a.id.localeCompare(b.id));

  for (const pattern of patterns) {
    const header = [
      `// ${pkg.name}@${pkg.version} · ${pattern.name}`,
      `// Storybook: ${pattern.title} → ${pattern.name} (?path=/story/${pattern.id})`,
      "// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.",
    ].join("\n");
    outputs.set(path.join(docsDir, pattern.file), `${header}\n\n${pattern.code}\n`);
  }
  outputs.set(
    path.join(patternsDir, "index.json"),
    `${JSON.stringify(
      {
        package: pkg.name,
        version: pkg.version,
        patterns: patterns.map(({ id, title, name, file, source }) => ({
          id,
          title,
          name,
          file,
          storybook: `?path=/story/${id}`,
          source,
        })),
      },
      null,
      2,
    )}\n`,
  );

  // ── shadcn-style registry ───────────────────────────────────────────────
  // Each pattern is a block whose Show code imports only package exports, so an item is the pattern
  // file plus its npm imports. React and Next.js come from the app.
  const appProvided = new Set(["react", "react-dom", "next"]);
  const npmPackage = (specifier) => specifier.split("/").slice(0, specifier.startsWith("@") ? 2 : 1).join("/");
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "wmds",
    homepage: pkg.homepage,
    items: patterns.map((pattern) => {
      const imports = [...pattern.code.matchAll(/^\s*(?:import|export)\b[^;]*?\bfrom\s+"([^"]+)"/gm)].map((match) => npmPackage(match[1]));
      const dependencies = [...new Set([pkg.name, ...imports.filter((name) => !appProvided.has(name))])].sort();
      return {
        name: pattern.id,
        type: "registry:block",
        title: `${pattern.title.split("/").at(-1)} — ${pattern.name.replace(/^Pattern — /, "")}`,
        description: `Show code for Storybook ${pattern.title} → ${pattern.name}.`,
        dependencies,
        files: [{ path: `docs/${pattern.file}`, type: "registry:component" }],
        docs: `Import "${pkg.name}/styles.css" once in the app before using this block.`,
      };
    }),
  };
  outputs.set(path.join(root, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`);

  // ── Export manifest ─────────────────────────────────────────────────────
  const tierOf = new Map(
    Object.entries(packageManifest.atomicExports).flatMap(([tier, names]) => names.map((name) => [name, tier.replace(/s$/, "")])),
  );
  const catalog = new Map(componentCatalog.map((entry) => [entry.name, entry]));
  const patternsByTitle = Map.groupBy(patterns, (pattern) => pattern.title);
  const component = (name) => {
    const entry = catalog.get(name);
    return {
      name,
      tier: tierOf.get(name) ?? null,
      category: entry?.category ?? null,
      summary: entry?.description ?? null,
      storybook: entry?.title ? { title: entry.title, docs: `?path=/docs/${toId(entry.title)}--docs` } : null,
      patterns: (entry?.title ? patternsByTitle.get(entry.title) ?? [] : []).map((pattern) => pattern.id),
    };
  };
  const exportsManifest = {
    package: pkg.name,
    version: pkg.version,
    import: `import { Button } from "${pkg.name}";`,
    styles: Object.keys(pkg.exports).filter((key) => key.endsWith(".css")).map((key) => `${pkg.name}${key.slice(1)}`),
    peerDependencies: pkg.peerDependencies,
    dependencies: pkg.dependencies,
    components: packageManifest.componentExports.map(component).sort((a, b) => a.name.localeCompare(b.name)),
    planned: [...packageManifest.plannedExports].sort(),
    lib: packageManifest.libExports.map(({ name }) => name),
    guides: [...patternsByTitle.keys()].filter((title) => title.startsWith("Guides/")),
  };
  outputs.set(path.join(docsDir, "exports.json"), `${JSON.stringify(exportsManifest, null, 2)}\n`);

  // ── Component contracts ─────────────────────────────────────────────────
  const agents = readFileSync(path.join(root, "AGENTS.md"), "utf8");
  const section = agents.split(/^## Storybook-first\s*$/m)[1]?.split(/^## /m)[0];
  if (!section) throw new Error("AGENTS.md has no ## Storybook-first section");
  const consumerTopics = new Set([
    ...packageManifest.componentExports,
    "Theme",
    "Dark mode",
    "Consuming apps",
    "Theme tokens",
    "Page layout",
    "Scroll fade",
    "Motion",
    "Icons",
    "Responsive",
    "Cluster scale",
  ]);
  const bullets = section
    .split(/\n(?=- \*\*)/)
    .map((bullet) => bullet.trim())
    .filter((bullet) => {
      const label = bullet.match(/^- \*\*([^*]+?):?\*\*/)?.[1];
      return label && consumerTopics.has(label);
    });
  outputs.set(
    path.join(docsDir, "components.md"),
    [
      `# ${pkg.name} — component contracts`,
      "",
      `Version ${pkg.version}. Generated from the WMDS repository's AGENTS.md (Storybook-first) by \`scripts/generate-package-docs.mjs\` — do not edit here.`,
      "",
      "Storybook paths such as **Components/Button/Button → Pattern — …** name a story; its Show code is in `patterns/` (see `patterns/index.json`). Longer contracts for FooterReveal, HeroTileStack, TextSequence, ScrollHorizontal, RiveHand, and PromptBar are in `component-contracts.md`. ADR numbers refer to decision records in the WMDS repository.",
      "",
      ...bullets,
      "",
    ].join("\n"),
  );
} finally {
  await server.close();
}

// ── Write or check ──────────────────────────────────────────────────────
const stale = [];
const existingPatterns = existsSync(patternsDir) ? readdirSync(patternsDir).map((name) => path.join(patternsDir, name)) : [];
for (const file of existingPatterns) if (!outputs.has(file)) stale.push(file);

if (check) {
  const problems = [...stale.map((file) => `no longer generated: ${path.relative(root, file)}`)];
  for (const [file, content] of outputs) {
    if (!existsSync(file)) problems.push(`missing: ${path.relative(root, file)}`);
    else if (readFileSync(file, "utf8") !== content) problems.push(`differs from Storybook: ${path.relative(root, file)}`);
  }
  if (problems.length) {
    for (const problem of problems) console.error(`package-docs: ${problem}`);
    console.error("package-docs: run `npm run docs:generate` and commit the result.");
    process.exit(1);
  }
  console.log(`package-docs: ${outputs.size} files match Storybook`);
} else {
  for (const file of stale) rmSync(file);
  mkdirSync(patternsDir, { recursive: true });
  for (const [file, content] of outputs) writeFileSync(file, content);
  console.log(`package-docs: wrote ${outputs.size} files (${outputs.size - 4} patterns)`);
}
