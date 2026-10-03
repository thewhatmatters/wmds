// @whatmatters/wmds@0.2.0 · Pattern — vertical actions
// Storybook: Components/Button/FloatingActionButton → Pattern — vertical actions (?path=/story/components-button-floatingactionbutton--vertical-actions)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Camera, FileText, Image, Pencil } from "lucide-react";
import { FloatingActionButton } from "@whatmatters/wmds";

<FloatingActionButton
  className="fixed bottom-4 right-4"
  backdrop
  items={[
    { id: "camera", label: "Camera", icon: <Camera /> },
    { id: "image", label: "Image", icon: <Image /> },
    { id: "file", label: "File", icon: <FileText /> },
    { id: "edit", label: "Edit", icon: <Pencil /> },
  ]}
  onAction={(id) => performAction(id)}
/>
