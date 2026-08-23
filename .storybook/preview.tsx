import type { Preview } from "@storybook/react-vite";
import "../src/styles/global.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Light or dark token set",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, { globals, viewMode, parameters }) => {
      const padded = parameters.layout === "padded";

      return (
        <div
          data-wmds-theme={globals.theme === "dark" ? "dark" : undefined}
          className={[
            "bg-bg text-fg font-sans w-full",
            viewMode === "story"
              ? padded
                ? "min-h-[100svh] p-6"
                : "flex min-h-[100svh] w-full items-center justify-center p-6"
              : "p-4",
          ].join(" ")}
        >
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    options: {
      /** Foundation → Components → Examples; components A→Z by kind (title). */
      storySort: {
        method: "alphabetical-by-kind",
        order: ["Foundation", "Components", "Examples"],
      },
    },
    /** Decorator owns centering — avoid Storybook's `centered` layout (shrinks canvas to content width). */
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
