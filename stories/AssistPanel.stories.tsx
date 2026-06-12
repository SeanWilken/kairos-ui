import type { Meta, StoryObj } from "@storybook/react";
import AssistPanel, { type AssistPanelProps, type AssistButtonProps } from "../src/components/AssistPanel";
import { Sparkles, GitBranch, Copy, ListChecks, HelpCircle, Archive } from 'lucide-react';


const meta = {
  title: "Components/Assist Panel",
  component: AssistPanel,
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
} satisfies Meta<typeof AssistPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ( 
    <div className="h-[100dvh] min-h-[100dvh]">
      <AssistPanel 
        icon={Sparkles}
        panelTitle={'Assistance'}
        panelControls={[
          {
            icon:GitBranch,
            label:'Suggest clusters',
            action:()=>{}
          },
          {
            icon:Copy,
            label:'Find duplicate ideas',
            action:()=>{}
          },
          {
            icon:ListChecks,
            label:'Identify dependencies',
            action:()=>{}
          },
          {
            icon:ListChecks,
            label:'Pull out requirements',
            action:()=>{}
          },
          {
            icon:HelpCircle,
            label:'Create questions',
            action:()=>{}
          },
          {
            icon:Archive,
            label:'Move weak ideas to backburner',
            action:()=>{}
          },
        ]}
      />
    </div>
  ),
};
