import type { Parameters } from "@storybook/react-vite";

const copySourceEnabled = {
  type: "code" as const,
  language: "tsx" as const,
  disable: false,
};

/**
 * Default for component `meta.parameters` — hide Show code unless a Pattern story opts in.
 * Also applied globally in `.storybook/preview.tsx`.
 */
export function storyMetaDocsDefaults(): Pick<Parameters, "docs"> {
  return {
    docs: {
      source: {
        disable: true,
      },
    },
  };
}

/**
 * Storybook docs source — copy-paste-ready app code only.
 * Pattern stories must use this instead of auto-generated CSF (name / parameters / render).
 */
export function storyCopySource(code: string): Pick<Parameters, "docs"> {
  return {
    docs: {
      source: {
        ...copySourceEnabled,
        code: code.trim(),
      },
    },
  };
}

/** Merge existing story parameters with an explicit copy source block. */
export function withStoryCopySource(parameters: Parameters | undefined, code: string): Parameters {
  return {
    ...parameters,
    docs: {
      ...parameters?.docs,
      source: {
        ...copySourceEnabled,
        code: code.trim(),
      },
    },
  };
}

/** Merge `source.disable: true` into an existing `docs` block (anatomy / reference stories). */
export function docsWithoutCode(docs: NonNullable<Parameters["docs"]>): NonNullable<Parameters["docs"]> {
  return {
    ...docs,
    source: {
      ...docs.source,
      disable: true,
    },
  };
}
