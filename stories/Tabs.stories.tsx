import type { Meta, StoryObj } from "@storybook/react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../src/components/ui/tabs";

const meta = {
  title: "Navigation/Tabs",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[540px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="rounded-lg border p-4">
        Overview content panel
      </TabsContent>
      <TabsContent value="activity" className="rounded-lg border p-4">
        Activity content panel
      </TabsContent>
      <TabsContent value="settings" className="rounded-lg border p-4">
        Settings content panel
      </TabsContent>
    </Tabs>
  ),
};
