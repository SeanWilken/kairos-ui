import * as React from "react";
import { Bot, Sparkles } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "./ui/utils";

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
  className?: string;
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
  hideRememberMe = false,
  onSubmit,
  onForgotPassword,
  onRequestAccess,
  className,
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
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <aside className="bg-primary text-primary-foreground relative hidden overflow-hidden p-10 lg:block">
          <div className="relative z-10 flex h-full flex-col justify-center">
            <div className="bg-primary-foreground/10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
              <Bot className="size-10" />
            </div>
            <p className="mb-2 text-sm opacity-80">{appTitle}</p>
            <h1 className="mb-4 text-4xl font-semibold tracking-tight">{heroTitle}</h1>
            <p className="max-w-lg text-lg opacity-90">{heroDescription}</p>
          </div>
          <div className="bg-primary-foreground/10 absolute -left-12 top-10 size-40 rounded-full blur-3xl" />
          <div className="bg-primary-foreground/10 absolute -bottom-10 right-8 size-48 rounded-full blur-3xl" />
        </aside>

        <main className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-semibold tracking-tight">{welcomeTitle}</h2>
              <p className="text-muted-foreground text-sm">{welcomeDescription}</p>
              {notice ? <div className="mt-3">{notice}</div> : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="auth-login-email" className="text-sm">
                  Email address
                </Label>
                <Input
                  id="auth-login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-login-password" className="text-sm">
                  Password
                </Label>
                <Input
                  id="auth-login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {!hideRememberMe || !hideForgotPassword ? (
                <div className="flex items-center justify-between gap-3">
                  {!hideRememberMe ? (
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRememberMe(Boolean(checked))} />
                      <span className="text-muted-foreground">{rememberMeLabel}</span>
                    </label>
                  ) : (
                    <span />
                  )}

                  {!hideForgotPassword ? (
                    <Button type="button" variant="link" className="h-auto p-0 text-sm" onClick={onForgotPassword}>
                      {forgotPasswordLabel}
                    </Button>
                  ) : null}
                </div>
              ) : null}

              <Button type="submit" disabled={isLoading} className="w-full gap-2">
                {isLoading ? <Sparkles className="size-4 animate-spin" /> : null}
                {isLoading ? submittingLabel : submitLabel}
              </Button>

              {error ? (
                <Alert variant="destructive">
                  <AlertTitle>Sign in failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
            </form>

            {!hideRequestAccess ? (
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground mr-1">Don&apos;t have an account?</span>
                <Button type="button" variant="link" className="h-auto p-0 text-sm" onClick={onRequestAccess}>
                  {requestAccessLabel}
                </Button>
              </div>
            ) : null}

            <div className="mt-8 border-t pt-5">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Sparkles className="size-3" />
                <span>{enterpriseSsoLabel}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export { AuthLoginPage };
