import type { Meta, StoryObj } from "@storybook/react";
import { UnderstandingInsights } from "../src/components/UnderstandingInsight";

const meta = {
  title: "Components/Understanding Insights Panel",
  component: UnderstandingInsights,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        height: "560px",
      },
    },
  },
} satisfies Meta<typeof UnderstandingInsights>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[520px] bg-neutral-100">
      <UnderstandingInsights
        problem={'Designing an AI-readable knowledge index.'}
        assumptions={[
          'Agents should not receive raw data by default',
          'Sources should be described before being searched',
          'Humans define important relationships'
        ]}
        questions={[
          'How should access rules be represented?',
          'How should relationships be weighted?',
          'How much summary is enough?'
        ]}
        nextStep='Define the node schema for a knowledge source.'
      />
    </div>
  ),
};
