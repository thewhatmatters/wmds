// @thewhatmatters/wmds@0.4.30 · Pattern — save status
// Storybook: Components/TextArea → Pattern — save status (?path=/story/components-textarea--save-status)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

"use client";

import { useEffect, useState } from "react";
import { TextArea } from "@thewhatmatters/wmds";

export function NotesField() {
  const [value, setValue] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (saveState !== "saving") return;
    const timer = setTimeout(() => setSaveState("saved"), 600);
    return () => clearTimeout(timer);
  }, [saveState, value]);

  return (
    <TextArea
      label="Notes"
      description="Saved automatically as you type."
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        setSaveState("saving");
      }}
      liveStatus={saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : ""}
    />
  );
}
