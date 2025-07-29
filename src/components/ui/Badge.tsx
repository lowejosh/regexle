import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        correct:
          "border-transparent bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
        incorrect:
          "border-transparent bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        easy: "border border-easy-300 bg-easy-100 text-easy-800 hover:bg-easy-200 dark:border-easy-600 dark:bg-easy-900/30 dark:text-easy-300 dark:hover:bg-easy-900/50",
        medium:
          "border border-medium-300 bg-medium-100 text-medium-800 hover:bg-medium-200 dark:border-medium-600 dark:bg-medium-900/30 dark:text-medium-300 dark:hover:bg-medium-900/50",
        hard: "border border-hard-300 bg-hard-100 text-hard-800 hover:bg-hard-200 dark:border-hard-600 dark:bg-hard-900/30 dark:text-hard-300 dark:hover:bg-hard-900/50",
        expert:
          "border border-expert-300 bg-expert-100 text-expert-800 hover:bg-expert-200 dark:border-expert-600 dark:bg-expert-900/30 dark:text-expert-300 dark:hover:bg-expert-900/50",
        nightmare:
          "border border-nightmare-300 bg-nightmare-100 text-nightmare-800 hover:bg-nightmare-200 dark:border-nightmare-600 dark:bg-nightmare-900/30 dark:text-nightmare-300 dark:hover:bg-nightmare-900/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
