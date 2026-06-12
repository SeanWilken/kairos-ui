import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Label, Slider } from "../../src";

const meta = {
  title: "Elements/Controls/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    value: { control: "object", description: "Controlled range array value." },
    onValueChange: { action: "value changed" },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [value, setValue] = React.useState([35]);
    return (
      <div className="w-80 space-y-3 p-6">
        <Label>Effort ({value[0]})</Label>
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
        <pre className="rounded bg-muted/30 p-2 text-xs">{JSON.stringify({ value }, null, 2)}</pre>
      </div>
    );
  },
};
