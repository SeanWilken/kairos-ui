import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../src";

const meta = {
  title: "Elements/Navigation/Accordion",
  component: Accordion,
  subcomponents: {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  },
  tags: ["autodocs"],
  args: {
    type: "single",
    collapsible: true,
  },
  argTypes: {
    type: { control: "radio", options: ["single", "multiple"] },
    collapsible: { control: "boolean" },
    defaultValue: { control: "text" },
    value: { control: "text" },
    onValueChange: { action: "value changed" },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} type="single" collapsible className="w-[520px] rounded-md border px-3">
      <AccordionItem value="context">
        <AccordionTrigger>Context</AccordionTrigger>
        <AccordionContent>Source docs, timeline, and prior decisions.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
