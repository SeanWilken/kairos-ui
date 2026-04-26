import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Login } from "../src/components/StudioLogin";

const meta = {
  title: "Pages/Login",
  component: Login,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

function LoginPlayground() {
  const [email, setEmail] = React.useState("admin@kairosstack.dev");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState("");

  return (
    <Login
      appName="Kairos Studio"
      email={email}
      password={password}
      rememberMe={rememberMe}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onRememberMeChange={setRememberMe}
      onSubmit={(event) => {
        event.preventDefault();
        setError(password.length < 8 ? "Use at least 8 characters." : "");
      }}
      onForgotPassword={() => {
        setError("Forgot password flow not wired in Storybook.");
      }}
      error={error}
    />
  );
}

export const Interactive: Story = {
  render: () => <LoginPlayground />,
};
