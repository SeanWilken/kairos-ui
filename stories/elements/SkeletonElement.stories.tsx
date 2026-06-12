import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../../src";

const meta = {
  title: "Elements/Display/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text", description: "Controls skeleton size and shape classes." },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-2 p-6">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  ),
};
