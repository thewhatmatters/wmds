// @thewhatmatters/wmds@0.4.2 · Pattern — copy button
// Storybook: Components/Button/Button → Pattern — copy button (?path=/story/components-button-button--copy-button)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Button, buttonStatusHoldMs, type ButtonStatus } from "@thewhatmatters/wmds";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = window.setTimeout(() => setStatus("idle"), buttonStatusHoldMs);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Button
      role="secondary"
      size="sm"
      icon={<Copy />}
      status={status}
      statusLabels={{ success: "Copied", error: "Couldn't copy" }}
      onClick={copy}
    >
      {label}
    </Button>
  );
}
