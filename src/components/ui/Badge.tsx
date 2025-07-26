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
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        incorrect: "border-transparent bg-red-500 text-white hover:bg-red-600",
        easy: "border border-green-300 bg-green-100 text-green-800 hover:bg-green-200",
        medium:
          "border border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        hard: "border border-orange-300 bg-orange-100 text-orange-800 hover:bg-orange-200",
        expert:
          "border border-red-300 bg-red-100 text-red-800 hover:bg-red-200",
        nightmare:
          "border border-purple-300 bg-purple-100 text-purple-800 hover:bg-purple-200",
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
