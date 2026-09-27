import { TextSequence } from "../../molecules/TextSequence/TextSequence";

/**
 * Placeholder gallery statement with three display-size marks.
 * Returns a fragment so **TextSequence** can split the words.
 * The plain sentence matches `scrollHorizontalIntroStatement`.
 */
export function scrollHorizontalIntroStatementNodes() {
  return (
    <>
      {"Placeholder"}
      <TextSequence.Shape variant="asterisk" />
      {" statement — a bold, left-aligned "}
      <TextSequence.Shape variant="pill" tone="brand-soft" />
      {" line about the work "}
      <TextSequence.Shape variant="diamond" tone="accent" />
      {" WhatMatters does for brands goes here."}
    </>
  );
}

/** Show-code mirror of scrollHorizontalIntroStatementNodes. Paste inside `statement`. */
export const scrollHorizontalIntroStatementMarkup = `{
  <>
    {"Placeholder"}
    <TextSequence.Shape variant="asterisk" />
    {" statement — a bold, left-aligned "}
    <TextSequence.Shape variant="pill" tone="brand-soft" />
    {" line about the work "}
    <TextSequence.Shape variant="diamond" tone="accent" />
    {" WhatMatters does for brands goes here."}
  </>
}`;
