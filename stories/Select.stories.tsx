import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../src/components/ui/select";

const meta = {
  title: "Forms/Select",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledSelectStory() {
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="w-[320px] space-y-3">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Roles</SelectLabel>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">Selected value: {value || "None"}</p>
    </div>
  );
}

export const PlaceholderBehavior: Story = {
  render: () => <ControlledSelectStory />,
};

export const GroupedOptions: Story = {
  render: () => (
    <div className="w-[320px]">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Account</SelectLabel>
            <SelectItem value="profile">Profile</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Team</SelectLabel>
            <SelectItem value="members">Members</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};
