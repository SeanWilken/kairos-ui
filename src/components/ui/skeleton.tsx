import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const skeletonVariants = cva("bg-accent rounded-md", {
  variants: {
    variant: {
      default: "",
      text: "h-4",
      avatar: "size-10 rounded-full",
      button: "h-9 w-24",
      input: "h-10 w-full",
      menuItem: "h-8 w-full",
    },
    animation: {
      pulse: "animate-pulse",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    animation: "pulse",
  },
});

type SkeletonProps = React.ComponentProps<"div"> &
  VariantProps<typeof skeletonVariants>;

function Skeleton({ className, variant, animation, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-variant={variant ?? "default"}
      className={cn(skeletonVariants({ variant, animation }), className)}
      {...props}
    />
  );
}

function SkeletonText({
  lines = 3,
  className,
  lineClassName,
  animation,
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
  animation?: "pulse" | "none";
}) {
  return (
    <div data-slot="skeleton-text" className={cn("space-y-2", className)}>
      {Array.from({ length: Math.max(1, lines) }).map((_, i) => (
        <Skeleton
          key={`line-${i}`}
          variant="text"
          animation={animation}
          className={cn(i === lines - 1 ? "w-2/3" : "w-full", lineClassName)}
        />
      ))}
    </div>
  );
}

function SkeletonMenu({
  items = 5,
  className,
  itemClassName,
  animation,
}: {
  items?: number;
  className?: string;
  itemClassName?: string;
  animation?: "pulse" | "none";
}) {
  return (
    <div data-slot="skeleton-menu" className={cn("space-y-1", className)}>
      {Array.from({ length: Math.max(1, items) }).map((_, i) => (
        <Skeleton
          key={`item-${i}`}
          variant="menuItem"
          animation={animation}
          className={cn(i % 3 === 0 ? "w-5/6" : "w-full", itemClassName)}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonMenu, skeletonVariants };
