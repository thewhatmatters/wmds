// @thewhatmatters/wmds@0.3.0 · Pattern — stacked notifications
// Storybook: Components/Toast → Pattern — stacked notifications (?path=/story/components-toast--stacked-notifications)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, Toaster, toast } from "@thewhatmatters/wmds";

export function App() {
  return (
    <>
      <Button
        onClick={() => {
          toast.add({
            title: "Post hidden",
            description: "The post was removed from your shareable kit.",
            action: {
              label: "Undo",
              onClick: (id) => {
                // Restore the hidden post in app state.
                toast.dismiss(id);
              },
              dismiss: false,
            },
          });
        }}
      >
        Hide post
      </Button>
      <Toaster position="bottom-right" maxVisible={5} />
    </>
  );
}
