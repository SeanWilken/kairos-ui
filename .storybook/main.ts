import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];

    const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
    const shouldUseRepoBase = process.env.GITHUB_ACTIONS === "true" && repoName;

    if (shouldUseRepoBase) {
      viteConfig.base = `/${repoName}/`;
    }

    return viteConfig;
  },
};

export default config;
