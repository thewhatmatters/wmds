/**
 * TextSequence shell. Word weight lives here so the molecule TSX does not
 * carry raw type utilities. The parent owns the type step.
 */

export const textSequenceRootClasses = "block w-full";

/** Even words when `emphasis` is `alternate`. */
export const textSequenceWordRegularClasses = "font-normal";

/** Odd words when `emphasis` is `alternate`. */
export const textSequenceWordBoldClasses = "font-bold";
