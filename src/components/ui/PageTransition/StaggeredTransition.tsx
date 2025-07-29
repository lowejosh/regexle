import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StaggeredTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  variant?: "slide" | "fade" | "scale" | "slideUp";
}

const variants = {
  slide: {
    hidden: "opacity-0 translate-x-4",
    visible: "opacity-100 translate-x-0",
  },
  fade: {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
  scale: {
    hidden: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
  slideUp: {
    hidden: "opacity-0 translate-y-2",
    visible: "opacity-100 translate-y-0",
  },
};

export function StaggeredTransition({
  children,
  className,
  delay = 100,
  staggerDelay = 100,
  variant = "slideUp",
}: StaggeredTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const variantClasses = variants[variant];

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isVisible ? variantClasses.visible : variantClasses.hidden,
        className
      )}
      style={{
        transitionDelay: `${staggerDelay}ms`,
      }}
    >
      {children}
    </div>
  );
}
