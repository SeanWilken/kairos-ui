import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { StudioLogin } from "./StudioLogin";

export type LoginFormPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type AuthLoginPageProps = {
  appTitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  welcomeTitle?: string;
  welcomeDescription?: string;
  notice?: React.ReactNode;
  initialEmail?: string;
  rememberMeLabel?: string;
  forgotPasswordLabel?: string;
  requestAccessLabel?: string;
  enterpriseSsoLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
  hideForgotPassword?: boolean;
  hideRequestAccess?: boolean;
  hideRememberMe?: boolean;
  onSubmit: (payload: LoginFormPayload) => Promise<void> | void;
  onForgotPassword?: () => void;
  onRequestAccess?: () => void;
};

function AuthLoginPage({
  appTitle = "Kairos",
  heroTitle = "Studio",
  heroDescription = "Manage users, workspaces, and AI resources all in one place. Get started by signing in.",
  welcomeTitle = "Welcome back",
  welcomeDescription = "Sign in to continue",
  notice,
  initialEmail = "",
  rememberMeLabel = "Remember me",
  forgotPasswordLabel = "Forgot password?",
  requestAccessLabel = "Request access",
  enterpriseSsoLabel = "Enterprise SSO available",
  submitLabel = "Sign in",
  submittingLabel = "Signing in...",
  hideForgotPassword = false,
  hideRequestAccess = false,
  hideRememberMe = false, // kept for compatibility
  onSubmit,
  onForgotPassword,
  onRequestAccess,
}: AuthLoginPageProps) {
  const [email, setEmail] = React.useState(initialEmail);
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await onSubmit({ email, password, rememberMe });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudioLogin
      appName={appTitle}
      welcomeTitle={heroTitle}
      welcomeDescription={heroDescription}
      formTitle={welcomeTitle}
      formDescription={welcomeDescription}
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      rememberMe={rememberMe}
      onRememberMeChange={setRememberMe}
      rememberMeLabel={rememberMeLabel}
      forgotPasswordLabel={forgotPasswordLabel}
      submitLabel={submitLabel}
      submittingLabel={submittingLabel}
      secureSignInLabel={enterpriseSsoLabel}
      hideRememberMe={hideRememberMe}
      hideForgotPassword={hideForgotPassword}
      onForgotPassword={onForgotPassword}
      notice={notice}
      footer={
        !hideRequestAccess ? (
          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <button type="button" className="text-primary hover:underline" onClick={onRequestAccess}>
              {requestAccessLabel}
            </button>
          </p>
        ) : undefined
      }
    />
  );
}

export { AuthLoginPage };
