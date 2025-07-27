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
        easy: "border border-green-300 bg-green-100 text-green-800 hover:bg-green-200 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50",
        medium:
          "border border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50",
        hard: "border border-orange-300 bg-orange-100 text-orange-800 hover:bg-orange-200 dark:border-orange-600 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50",
        expert:
          "border border-red-300 bg-red-100 text-red-800 hover:bg-red-200 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50",
        nightmare:
          "border border-purple-300 bg-purple-100 text-purple-800 hover:bg-purple-200 dark:border-purple-600 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50",
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
