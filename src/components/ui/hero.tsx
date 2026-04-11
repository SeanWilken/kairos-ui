import * as React from "react";

import { cn } from "./utils";

type HeroClassNames = {
  root?: string;
  content?: string;
  heading?: string;
  actions?: string;
  media?: string;
  title?: string;
  description?: string;
};

const HeroClassNameContext = React.createContext<HeroClassNames>({});

function Hero({
  className,
  classNames,
  ...props
}: React.ComponentProps<"section"> & {
  classNames?: HeroClassNames;
}) {
  return (
    <HeroClassNameContext.Provider value={classNames ?? {}}>
      <section
        data-slot="hero"
        className={cn(
          "grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-[1fr_auto] md:items-center",
          classNames?.root,
          className,
        )}
        {...props}
      />
    </HeroClassNameContext.Provider>
  );
}

function HeroContent({ className, ...props }: React.ComponentProps<"div">) {
  const classNames = React.useContext(HeroClassNameContext);
  return (
    <div
      data-slot="hero-content"
      className={cn("space-y-3", classNames.content, className)}
      {...props}
    />
  );
}

function HeroHeading({ className, ...props }: React.ComponentProps<"div">) {
  const classNames = React.useContext(HeroClassNameContext);
  return (
    <div
      data-slot="hero-heading"
      className={cn("space-y-1", classNames.heading, className)}
      {...props}
    />
  );
}

function HeroTitle({ className, ...props }: React.ComponentProps<"h1">) {
  const classNames = React.useContext(HeroClassNameContext);
  return (
    <h1
      data-slot="hero-title"
      className={cn("text-2xl font-semibold tracking-tight", classNames.title, className)}
      {...props}
    />
  );
}

function HeroDescription({ className, ...props }: React.ComponentProps<"p">) {
  const classNames = React.useContext(HeroClassNameContext);
  return (
    <p
      data-slot="hero-description"
      className={cn("text-muted-foreground text-sm", classNames.description, className)}
      {...props}
    />
  );
}

function HeroActions({ className, ...props }: React.ComponentProps<"div">) {
  const classNames = React.useContext(HeroClassNameContext);
  return (
    <div
      data-slot="hero-actions"
      className={cn("flex flex-wrap items-center gap-2", classNames.actions, className)}
      {...props}
    />
  );
}

function HeroMedia({ className, ...props }: React.ComponentProps<"div">) {
  const classNames = React.useContext(HeroClassNameContext);
  return (
    <div
      data-slot="hero-media"
      className={cn("justify-self-end", classNames.media, className)}
      {...props}
    />
  );
}

export {
  Hero,
  HeroActions,
  HeroContent,
  HeroDescription,
  HeroHeading,
  HeroMedia,
  HeroTitle,
};
export type { HeroClassNames };
