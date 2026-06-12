import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { InputOTP, InputOTPGroup, InputOTPSlot, Label } from "../../src";

const meta = {
  title: "Elements/Controls/Input OTP",
  component: InputOTP,
  tags: ["autodocs"],
  args: {
    maxLength: 6,
    disabled: false,
  },
  argTypes: {
    maxLength: { control: "number" },
    disabled: { control: "boolean" },
    value: { control: "text", description: "Controlled OTP value string." },
    onChange: { action: "changed" },
    onComplete: { action: "completed" },
  },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <div className="space-y-3 p-6">
        <Label>Verification code</Label>
        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <pre className="rounded bg-muted/30 p-2 text-xs">{JSON.stringify({ value }, null, 2)}</pre>
      </div>
    );
  },
};
