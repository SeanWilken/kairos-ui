import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../../src";

const meta = {
  title: "Elements/Controls/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { checked: false, disabled: false },
  argTypes: {
    checked: { control: "boolean", description: "Controlled switch state." },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "toggled", description: "Callback with next boolean state." },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { checked: true } };
