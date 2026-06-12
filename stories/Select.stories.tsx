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
  title: "Elements/Controls/Select",
  component: Select,
  subcomponents: {
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Controlled selected value.",
      table: { category: "Root API", type: { summary: "string" } },
    },
    defaultValue: {
      control: "text",
      description: "Initial value for uncontrolled mode.",
      table: { category: "Root API", type: { summary: "string" } },
    },
    open: {
      control: "boolean",
      description: "Controlled open state.",
      table: { category: "Root API", type: { summary: "boolean" } },
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state for uncontrolled mode.",
      table: { category: "Root API", type: { summary: "boolean" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the select root and trigger interactions.",
      table: { category: "Root API", type: { summary: "boolean" } },
    },
    required: {
      control: "boolean",
      description: "Marks the field required in forms.",
      table: { category: "Root API", type: { summary: "boolean" } },
    },
    name: {
      control: "text",
      description: "Form field name for submission payloads.",
      table: { category: "Root API", type: { summary: "string" } },
    },
    onValueChange: {
      action: "value changed",
      description: "Callback invoked with selected value.",
      table: { category: "Root API", type: { summary: "(value: string) => void" } },
    },
  },
  args: {
    value: "",
    defaultValue: "",
    open: false,
    defaultOpen: false,
    disabled: false,
    required: false,
    name: "",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Controlled select examples with returned values. Use `value` + `onValueChange` to drive form state and submit payloads. Compound-slot props are documented under subcomponents (SelectTrigger, SelectContent, SelectItem, SelectValue).",
      },
    },
  },
} satisfies Meta<typeof Select>;

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

export const ReturnedValue: Story = {
  render: () => {
    const [role, setRole] = React.useState("editor");
    const payload = { role };

    return (
      <div className="grid w-[640px] gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Role selection</p>
          <Select value={role} onValueChange={setRole}>
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
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-sm text-muted-foreground">Returned value payload</p>
          <pre className="rounded bg-background p-3 text-xs">{JSON.stringify(payload, null, 2)}</pre>
        </div>
      </div>
    );
  },
};
