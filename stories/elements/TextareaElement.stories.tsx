import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../../src";

const meta = {
  title: "Elements/Controls/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    placeholder: "Add details",
    disabled: false,
    rows: 4,
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    rows: { control: "number" },
    value: { control: "text", description: "Controlled textarea value." },
    onChange: { action: "changed" },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
