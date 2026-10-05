// @thewhatmatters/wmds@0.4.5 · Shapes
// Storybook: Components/TextSequence → Shapes (?path=/story/components-textsequence--shapes)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { TextSequence } from "@thewhatmatters/wmds";

export function ShapeGallery() {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-10 sm:grid-cols-2">
      <figure className="flex flex-col items-center gap-3">
        <p className="type-display-3 text-center text-fg">
          <TextSequence emphasis="none" idle stagger={0.05}>
            <TextSequence.Shape variant="asterisk" /> asterisk{" "}
            <TextSequence.Shape variant="pill" tone="brand-soft" /> pill{" "}
            <TextSequence.Shape variant="diamond" tone="accent" /> diamond{" "}
            <TextSequence.Shape variant="dots" /> dots{" "}
            <TextSequence.Shape variant="double-pill" tone="info-muted" /> double-pill{" "}
            <TextSequence.Shape variant="circle" tone="accent" /> circle{" "}
            <TextSequence.Shape variant="smiley" /> smiley
          </TextSequence>
        </p>
        <figcaption className="type-label text-muted">Display</figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-3">
        <p className="type-large text-center text-fg">
          <TextSequence emphasis="none" idle stagger={0.05}>
            <TextSequence.Shape variant="asterisk" /> asterisk{" "}
            <TextSequence.Shape variant="pill" tone="brand-soft" /> pill{" "}
            <TextSequence.Shape variant="diamond" tone="accent" /> diamond{" "}
            <TextSequence.Shape variant="dots" /> dots{" "}
            <TextSequence.Shape variant="double-pill" tone="info-muted" /> double-pill{" "}
            <TextSequence.Shape variant="circle" tone="accent" /> circle{" "}
            <TextSequence.Shape variant="smiley" /> smiley
          </TextSequence>
        </p>
        <figcaption className="type-label text-muted">Subtext</figcaption>
      </figure>
    </div>
  );
}
