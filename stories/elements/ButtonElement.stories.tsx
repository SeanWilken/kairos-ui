import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../src";

const meta = {
  title: "Elements/Controls/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button", variant: "default", size: "default", disabled: false },
  argTypes: {
    variant: { control: "select", options: ["default", "destructive", "outline", "secondary", "ghost", "link"] },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Outline: Story = { args: { variant: "outline", children: "Outline" } };
