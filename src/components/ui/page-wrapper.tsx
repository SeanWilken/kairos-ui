import * as React from "react";

import { cn } from "./utils";

type PageWidth = "full" | "7xl" | "6xl" | "5xl";

const widthClassMap: Record<PageWidth, string> = {
  full: "max-w-none",
  "7xl": "max-w-7xl",
  "6xl": "max-w-6xl",
  "5xl": "max-w-5xl",
};

function PageWrapper({
  className,
  width = "7xl",
  padded = true,
  ...props
}: React.ComponentProps<"div"> & {
  width?: PageWidth;
  padded?: boolean;
}) {
  return (
    <div
      data-slot="page-wrapper"
      className={cn(
        "mx-auto w-full",
        widthClassMap[width],
        padded && "px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}

function PageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <header
      data-slot="page-header"
      className={cn("mb-6 flex items-start justify-between gap-4", className)}
      {...props}
    />
  );
}

function PageSection({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="page-section"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}

function PageActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

export { PageActions, PageHeader, PageSection, PageWrapper };
export type { PageWidth };
