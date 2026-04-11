import * as React from "react";

import { cn } from "./utils";

type AppShellClassNames = {
  root?: string;
  sidebar?: string;
  main?: string;
  header?: string;
  body?: string;
};

const AppShellClassNameContext = React.createContext<AppShellClassNames>({});

function AppShell({
  className,
  classNames,
  ...props
}: React.ComponentProps<"div"> & {
  classNames?: AppShellClassNames;
}) {
  return (
    <AppShellClassNameContext.Provider value={classNames ?? {}}>
      <div
        data-slot="app-shell"
        className={cn("grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]", classNames?.root, className)}
        {...props}
      />
    </AppShellClassNameContext.Provider>
  );
}

function AppShellSidebar({ className, ...props }: React.ComponentProps<"aside">) {
  const classNames = React.useContext(AppShellClassNameContext);
  return (
    <aside
      data-slot="app-shell-sidebar"
      className={cn("border-r bg-card p-4", classNames.sidebar, className)}
      {...props}
    />
  );
}

function AppShellMain({ className, ...props }: React.ComponentProps<"main">) {
  const classNames = React.useContext(AppShellClassNameContext);
  return (
    <main
      data-slot="app-shell-main"
      className={cn("min-w-0", classNames.main, className)}
      {...props}
    />
  );
}

function AppShellHeader({ className, ...props }: React.ComponentProps<"header">) {
  const classNames = React.useContext(AppShellClassNameContext);
  return (
    <header
      data-slot="app-shell-header"
      className={cn("border-b bg-background px-4 py-3 sm:px-6", classNames.header, className)}
      {...props}
    />
  );
}

function AppShellBody({ className, ...props }: React.ComponentProps<"div">) {
  const classNames = React.useContext(AppShellClassNameContext);
  return (
    <div
      data-slot="app-shell-body"
      className={cn("p-4 sm:p-6", classNames.body, className)}
      {...props}
    />
  );
}

export { AppShell, AppShellBody, AppShellHeader, AppShellMain, AppShellSidebar };
export type { AppShellClassNames };
