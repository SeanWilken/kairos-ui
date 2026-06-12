import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../src";

const meta = {
  title: "Elements/Controls/Input",
  component: Input,
  tags: ["autodocs"],
  args: { placeholder: "Type here", type: "text", disabled: false },
  argTypes: {
    type: { control: "text", description: "Native input type (text, email, password, number, etc)." },
    placeholder: { control: "text", description: "Placeholder text." },
    disabled: { control: "boolean", description: "Disable interaction." },
    value: { control: "text", description: "Controlled input value." },
    onChange: { action: "changed", description: "Input change event callback." },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
