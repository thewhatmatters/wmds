/**
 * Check the package against src/package.manifest.ts — the manifest is read, not copied.
 *
 * - every manifest component has a folder that src/index.ts exports from
 * - nothing is exported from a component folder the manifest does not list
 * - planned components are not exported yet
 * - dist/styles.css has the required utilities
 * - dist CSS only references files that ship in dist
 * - every package the built modules import is a dependency or a peer dependency
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");
const read = (file) => readFileSync(path.join(root, file), "utf8");

/** The manifest is TypeScript. Transpile it in memory so this script runs on any Node the build supports. */
async function loadManifest() {
  const { outputText } = ts.transpileModule(read("src/package.manifest.ts"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  const module = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
  return module.packageManifest;
}

const manifest = await loadManifest();
const packageJson = JSON.parse(read("package.json"));
const errors = [];
const fail = (message) => errors.push(message);

// --- src/index.ts ↔ manifest
const exportedValues = new Set();
const exportedFolders = new Map(); // "atoms/Button" → tier
for (const [, typeOnly, names, from] of read("src/index.ts").matchAll(/export (type )?\{([^}]*)\} from "([^"]+)";/g)) {
  if (!typeOnly) {
    for (const entry of names.split(",")) {
      const name = entry.trim();
      if (name && !name.startsWith("type ")) exportedValues.add(name.split(/\s+as\s+/).pop());
    }
  }
  const folder = /^\.\/components\/(atoms|molecules|organisms)\/([^/]+)\//.exec(from);
  if (folder) exportedFolders.set(`${folder[1]}/${folder[2]}`, folder[1]);
}

for (const { name } of manifest.libExports) {
  if (!exportedValues.has(name)) fail(`src/index.ts does not export lib helper "${name}"`);
}

for (const [tier, names] of Object.entries(manifest.atomicExports)) {
  for (const name of names) {
    // The manifest names the component folder. Its exports may be named differently (Confetti → ConfettiProvider).
    if (!existsSync(path.join(root, "src/components", tier, name))) {
      fail(`manifest lists ${tier} "${name}" but src/components/${tier}/${name}/ does not exist`);
    } else if (!exportedFolders.has(`${tier}/${name}`)) {
      fail(`manifest lists ${tier} "${name}" but src/index.ts exports nothing from src/components/${tier}/${name}/`);
    }
  }
}

for (const [folder, tier] of exportedFolders) {
  const name = folder.split("/")[1];
  if (!manifest.atomicExports[tier].includes(name)) {
    fail(`src/index.ts exports from src/components/${folder}/ but the manifest does not list "${name}" under ${tier}`);
  }
}

for (const name of manifest.plannedExports) {
  const shipped = exportedValues.has(name) || [...exportedFolders.keys()].some((folder) => folder.endsWith(`/${name}`));
  if (shipped) {
    fail(`"${name}" is exported — move it from plannedExports into its tier in src/package.manifest.ts`);
  }
}

// --- package.json ↔ manifest
const peers = Object.keys(packageJson.peerDependencies ?? {}).sort();
if (peers.join() !== [...manifest.peerDependencies].sort().join()) {
  fail(`package.json peerDependencies (${peers.join(", ")}) differ from the manifest (${manifest.peerDependencies.join(", ")})`);
}

// --- dist
if (!existsSync(path.join(dist, "styles.css"))) {
  console.error("manifest: dist/styles.css not found — run npm run build first");
  process.exit(1);
}

const styles = readFileSync(path.join(dist, "styles.css"), "utf8");
for (const token of manifest.requiredStyleTokens) {
  if (!styles.includes(token)) fail(`dist/styles.css is missing required utility "${token}"`);
}

for (const file of readdirSync(dist).filter((name) => name.endsWith(".css"))) {
  const css = readFileSync(path.join(dist, file), "utf8");
  for (const [, target] of css.matchAll(/@import\s+"(\.\/[^"]+)"/g)) {
    if (!existsSync(path.join(dist, target))) fail(`dist/${file} imports ${target}, which is not in dist`);
  }
  for (const [, target] of css.matchAll(/url\((\.\/[^)]+)\)/g)) {
    if (!existsSync(path.join(dist, target))) fail(`dist/${file} references ${target}, which is not in dist`);
  }
}

function builtModules(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return builtModules(full);
    return entry.name.endsWith(".js") ? [full] : [];
  });
}

const declared = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
]);
const undeclared = new Map();
for (const file of builtModules(dist)) {
  const code = readFileSync(file, "utf8");
  for (const [, specifier] of code.matchAll(/(?:from|import)\s*"([^"./][^"]*)"/g)) {
    const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
    const umbrella = Object.entries(manifest.umbrellaPackages).find(([prefix]) => name.startsWith(prefix))?.[1];
    if (!declared.has(umbrella ?? name)) undeclared.set(name, path.relative(root, file));
  }
}
for (const [name, file] of undeclared) {
  fail(`${file} imports "${name}", which package.json lists as neither a dependency nor a peer dependency`);
}

if (errors.length > 0) {
  for (const message of errors) console.error(`manifest: ${message}`);
  process.exit(1);
}

console.log(
  `manifest: ${manifest.componentExports.length} components, ${manifest.libExports.length} lib helpers, dist CSS and imports OK`,
);
