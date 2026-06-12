import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "../../src";

const meta = {
  title: "Elements/Controls/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: {
    defaultPressed: false,
    disabled: false,
    children: "Bold",
  },
  argTypes: {
    defaultPressed: { control: "boolean" },
    pressed: { control: "boolean", description: "Controlled pressed state." },
    disabled: { control: "boolean" },
    onPressedChange: { action: "pressed changed" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
