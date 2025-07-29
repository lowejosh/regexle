import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageLayoutProps {
  /** Page title */
  title?: string;
  /** Page description/subtitle */
  description?: string;
  /** Maximum width of the page content */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Additional spacing between sections */
  spacing?: "tight" | "normal" | "relaxed";
  /** Show page header */
  showHeader?: boolean;
  /** Children content */
  children: React.ReactNode;
  /** Additional className for the container */
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-2xl", // ~672px - for narrow content
  md: "max-w-4xl", // ~896px - for standard content
  lg: "max-w-5xl", // ~1024px - for wide content
  xl: "max-w-6xl", // ~1152px - for extra wide content
  "2xl": "max-w-7xl", // ~1280px - for very wide content
  full: "max-w-full",
} as const;

const spacingClasses = {
  tight: "space-y-4",
  normal: "space-y-6",
  relaxed: "space-y-8",
} as const;

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  (
    {
      title,
      description,
      maxWidth = "xl",
      spacing = "normal",
      showHeader = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          maxWidthClasses[maxWidth],
          "mx-auto px-4 sm:px-6 py-6 sm:py-8",
          spacingClasses[spacing],
          className
        )}
        {...props}
      >
        {showHeader && (title || description) && (
          <div className="text-center space-y-2 mb-6 sm:mb-8">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
);

PageLayout.displayName = "PageLayout";
