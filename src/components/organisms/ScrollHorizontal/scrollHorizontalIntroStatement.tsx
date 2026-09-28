import { RiveHand } from "../../atoms/RiveHand/RiveHand";
import { TextSequence } from "../../molecules/TextSequence/TextSequence";

/**
 * Gallery statement. Asterisk and diamond stay. The point hand replaces the pill
 * after "is a first impression". The plain sentence matches `scrollHorizontalIntroStatement`.
 */
export function scrollHorizontalIntroStatementNodes() {
  return (
    <>
      {"Every screen"}
      <TextSequence.Shape variant="asterisk" />
      {" is a first impression"}
      <RiveHand hand="point" size="1cap" idle entrance="none" aria-hidden className="inline-block align-middle" />
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
    <RiveHand hand="point" size="1cap" idle entrance="none" aria-hidden className="inline-block align-middle" />
    {" and we make yours"}
    <TextSequence.Shape variant="diamond" tone="accent" />
    {" the one they remember."}
  </>
}`;
