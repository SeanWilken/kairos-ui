import type { Preview } from "@storybook/react";
import "../src/styles/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    backgrounds: {
      default: "app",
      values: [
        { name: "app", value: "var(--background)" },
        { name: "slate", value: "#f4f6f8" },
      ],
    },
  },
};

export default preview;
