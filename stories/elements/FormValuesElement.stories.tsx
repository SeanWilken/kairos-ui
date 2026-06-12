import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Button, Checkbox, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from "../../src";

const meta = {
  title: "Elements/Controls/Form Values",
  tags: ["autodocs"],
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfileForm: Story = {
  render: () => {
    const [name, setName] = React.useState("Alex Morgan");
    const [role, setRole] = React.useState("pm");
    const [subscribe, setSubscribe] = React.useState(true);
    const [beta, setBeta] = React.useState(false);

    return (
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-border bg-background p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pm">Product Manager</SelectItem>
                <SelectItem value="design">Design Lead</SelectItem>
                <SelectItem value="eng">Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <Label htmlFor="subscribe" className="cursor-pointer">Email updates</Label>
            <Checkbox id="subscribe" checked={subscribe} onCheckedChange={(value) => setSubscribe(Boolean(value))} />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <Label htmlFor="beta" className="cursor-pointer">Beta features</Label>
            <Switch id="beta" checked={beta} onCheckedChange={setBeta} />
          </div>

          <Button type="button" className="w-full">Save profile</Button>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
          <div className="text-sm text-muted-foreground">Live returned values</div>
          <pre className="overflow-auto rounded bg-background p-3 text-xs">
{JSON.stringify({ name, role, subscribe, beta }, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};
