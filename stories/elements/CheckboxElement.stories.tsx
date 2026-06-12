import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../../src";

const meta = {
  title: "Elements/Controls/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { checked: false, disabled: false },
  argTypes: {
    checked: { control: "boolean", description: "Controlled checked state." },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "checked changed", description: "Callback with boolean/indeterminate value." },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
