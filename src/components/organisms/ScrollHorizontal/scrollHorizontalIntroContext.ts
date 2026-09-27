import { createContext } from "react";

/** Id of the eyebrow that names the gallery section. Set only when `intro` is mounted. */
export const ScrollHorizontalIntroContext = createContext<string | undefined>(undefined);
