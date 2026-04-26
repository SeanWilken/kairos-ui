import * as React from "react";
import { motion } from "motion/react";
import { Bot, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export type StudioLoginProps = {
  appName?: string;
  welcomeTitle?: string;
  welcomeDescription?: string;
  formTitle?: string;
  formDescription?: string;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  error?: string;
  rememberMe?: boolean;
  rememberMeLabel?: string;
  forgotPasswordLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
  secureSignInLabel?: string;
  hideRememberMe?: boolean;
  hideForgotPassword?: boolean;
  onRememberMeChange?: (checked: boolean) => void;
  onForgotPassword?: () => void;
  extraFields?: React.ReactNode;
  notice?: React.ReactNode;
  footer?: React.ReactNode;
};

export function StudioLogin(props: StudioLoginProps) {
  const {
    appName = "Studio",
    welcomeTitle = "Studio",
    welcomeDescription = "Manage users, workspaces, and AI resources all in one place. Get started by signing in to your account.",
    formTitle = "Welcome back",
    formDescription = "Sign in to continue",
    email,
    password,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    isLoading = false,
    error = "",
    rememberMe = false,
    rememberMeLabel = "Remember me",
    forgotPasswordLabel = "Forgot password?",
    submitLabel = "Sign in",
    submittingLabel = "Signing in...",
    secureSignInLabel,
    hideRememberMe = false,
    hideForgotPassword = false,
    onRememberMeChange,
    onForgotPassword,
    extraFields,
    notice,
    footer,
  } = props;

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Bot className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl text-primary-foreground mb-4">{welcomeTitle}</h1>
            <p className="text-xl text-primary-foreground/80 max-w-md mx-auto">{welcomeDescription}</p>
          </motion.div>
        </div>

        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="mb-2">{formTitle}</h2>
            <p className="text-muted-foreground">{formDescription}</p>
            {notice ? <div className="mt-3">{notice}</div> : null}
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block mb-2 text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="you@company.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block mb-2 text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>

            {extraFields}

            {(!hideRememberMe || !hideForgotPassword) && (
              <div className="flex items-center justify-between">
                {!hideRememberMe ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => onRememberMeChange?.(event.target.checked)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground">{rememberMeLabel}</span>
                  </label>
                ) : (
                  <span />
                )}
                {!hideForgotPassword ? (
                  <button type="button" className="text-sm text-primary hover:underline" onClick={onForgotPassword}>
                    {forgotPasswordLabel}
                  </button>
                ) : null}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" /> {submittingLabel}</span>
              ) : (
                submitLabel
              )}
            </Button>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>

          {footer ? <div className="mt-6">{footer}</div> : null}

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              <span>{secureSignInLabel ?? `${appName} secure sign-in`}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
