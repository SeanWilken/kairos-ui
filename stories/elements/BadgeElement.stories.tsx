import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../src";

const meta = {
  title: "Elements/Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge" },
  argTypes: {
    variant: { control: "radio", options: ["default", "secondary", "destructive", "outline"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "Secondary" } };
