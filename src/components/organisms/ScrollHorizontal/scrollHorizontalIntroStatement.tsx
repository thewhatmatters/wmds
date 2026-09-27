import { TextSequence } from "../../molecules/TextSequence/TextSequence";

/**
 * Gallery statement with three display-size marks.
 * Returns a fragment so **TextSequence** can split the words.
 * The plain sentence matches `scrollHorizontalIntroStatement`.
 */
export function scrollHorizontalIntroStatementNodes() {
  return (
    <>
      {"Every screen"}
      <TextSequence.Shape variant="asterisk" />
      {" is a first impression"}
      <TextSequence.Shape variant="pill" tone="brand-soft" />
      {" and we make yours"}
      <TextSequence.Shape variant="diamond" tone="accent" />
      {" the one they remember."}
    </>
  );
}

/** Show-code mirror of scrollHorizontalIntroStatementNodes. Paste inside `statement`. */
export const scrollHorizontalIntroStatementMarkup = `{
  <>
    {"Every screen"}
    <TextSequence.Shape variant="asterisk" />
    {" is a first impression"}
    <TextSequence.Shape variant="pill" tone="brand-soft" />
    {" and we make yours"}
    <TextSequence.Shape variant="diamond" tone="accent" />
    {" the one they remember."}
  </>
}`;
