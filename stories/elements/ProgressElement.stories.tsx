import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "../../src";

const meta = {
  title: "Elements/Display/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: { value: 62 },
  argTypes: {
    value: { control: "number", description: "Progress value from 0-100." },
    className: { control: "text", description: "Custom className for progress root." },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80 p-6">
      <Progress {...args} />
    </div>
  ),
};
