import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../src";

const meta = {
  title: "Elements/Display/Card",
  component: Card,
  subcomponents: {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text", description: "Custom className for card container." },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-96">
      <CardHeader>
        <CardTitle>Workspace health</CardTitle>
        <CardDescription>Current operation status</CardDescription>
      </CardHeader>
      <CardContent>Healthy</CardContent>
    </Card>
  ),
};
