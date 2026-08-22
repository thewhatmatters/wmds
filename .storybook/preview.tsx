import type { Preview, ReactRenderer } from "@storybook/react-vite";
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
      const centered = viewMode === "story" && parameters.layout === "centered";
      return (
        <div
          data-wmds-theme={globals.theme === "dark" ? "dark" : undefined}
          className={[
            "bg-bg text-fg font-sans w-full",
            viewMode === "story"
              ? centered
                ? "flex min-h-[100vh] items-center justify-center p-6"
                : "min-h-[100vh] p-6"
              : "p-4",
          ].join(" ")}
        >
          <Story />
        </div>
      );
    },
  ],
  parameters: {
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
