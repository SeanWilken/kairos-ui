import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup, ToggleGroupItem } from "../../src";

const meta = {
  title: "Elements/Controls/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  args: {
    type: "multiple",
  },
  argTypes: {
    type: { control: "radio", options: ["single", "multiple"] },
    value: { control: "object", description: "Controlled value (`string` for single, `string[]` for multiple)." },
    defaultValue: { control: "object" },
    onValueChange: { action: "value changed" },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Multiple: Story = {
  render: () => (
    <div className="p-6">
      <ToggleGroup type="multiple" defaultValue={["a"]}>
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
        <ToggleGroupItem value="c" aria-label="C">C</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const Single: Story = {
  render: () => (
    <div className="p-6">
      <ToggleGroup type="single" defaultValue="b">
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
        <ToggleGroupItem value="c" aria-label="C">C</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};
