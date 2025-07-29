import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "slide" | "fade" | "scale" | "slideUp";
  delay?: number;
  duration?: number;
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
    hidden: "opacity-0 translate-y-4",
    visible: "opacity-100 translate-y-0",
  },
};

export function PageTransition({
  children,
  className,
  variant = "slideUp",
  delay = 50,
  duration = 500,
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset visibility on route change
    setIsVisible(false);

    // Small delay to ensure clean transition
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [location.pathname, delay]);

  const variantClasses = variants[variant];

  return (
    <div
      className={cn(
        "transition-all ease-out",
        isVisible ? variantClasses.visible : variantClasses.hidden,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
