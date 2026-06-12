import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Label, RadioGroup, RadioGroupItem } from "../../src";

const meta = {
  title: "Elements/Controls/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    defaultValue: "medium",
  },
  argTypes: {
    defaultValue: { control: "text", description: "Initial selected item for uncontrolled mode." },
    value: { control: "text", description: "Controlled selected value." },
    onValueChange: { action: "value changed", description: "Callback with next selected value." },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [value, setValue] = React.useState("medium");
    return (
      <div className="p-6 grid gap-3">
        <Label>Priority</Label>
        <RadioGroup value={value} onValueChange={setValue} className="flex gap-4">
          <div className="flex items-center gap-2"><RadioGroupItem value="low" id="rg-low" /><Label htmlFor="rg-low">Low</Label></div>
          <div className="flex items-center gap-2"><RadioGroupItem value="medium" id="rg-medium" /><Label htmlFor="rg-medium">Medium</Label></div>
          <div className="flex items-center gap-2"><RadioGroupItem value="high" id="rg-high" /><Label htmlFor="rg-high">High</Label></div>
        </RadioGroup>
        <pre className="rounded bg-muted/30 p-2 text-xs">{JSON.stringify({ value }, null, 2)}</pre>
      </div>
    );
  },
};
