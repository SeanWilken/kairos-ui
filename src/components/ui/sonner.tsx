import { Toaster as Sonner, ToasterProps } from "sonner";
import type { CSSProperties } from "react";

import { cn } from "./utils";

const Toaster = ({
  theme = "system",
  className,
  style,
  ...props
}: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className={cn("toaster group", className)}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          ...(style ?? {}),
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
