import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../src";

const meta = {
  title: "Elements/Display/Avatar",
  component: Avatar,
  subcomponents: {
    AvatarImage,
    AvatarFallback,
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text", description: "Custom className for avatar root." },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <Avatar>
        <AvatarFallback>KW</AvatarFallback>
      </Avatar>
    </div>
  ),
};
