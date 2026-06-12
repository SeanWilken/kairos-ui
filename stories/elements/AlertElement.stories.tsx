import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertDescription, AlertTitle } from "../../src";

const meta = {
  title: "Elements/Display/Alert",
  component: Alert,
  subcomponents: {
    AlertTitle,
    AlertDescription,
  },
  tags: ["autodocs"],
  args: {
    variant: "default",
  },
  argTypes: {
    variant: { control: "radio", options: ["default", "destructive"] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-xl p-6">
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Context window nearing threshold.</AlertDescription>
      </Alert>
    </div>
  ),
};
