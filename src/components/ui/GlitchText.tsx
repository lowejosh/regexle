import { useState, useEffect, useRef } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
  speed?: number; // milliseconds between character changes
  glitchChars?: string;
  revealDelay?: number; // delay before revealing actual text
}

const DEFAULT_GLITCH_CHARS =
  "!@#$%^&*()_+-=[]{}|;:,.<>?~`1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Originally had this for the description -- didnt like it, but it looked cool, might find another use

export function GlitchText({
  children,
  className = "",
  speed = 100,
  glitchChars = DEFAULT_GLITCH_CHARS,
  revealDelay = 0,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getRandomChar = () => {
      return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    };

    const generateGlitchText = (text: string) => {
      return text
        .split("")
        .map((char) => (char === " " ? " " : getRandomChar()))
        .join("");
    };

    if (revealDelay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsRevealed(true);
      }, revealDelay);
    }

    if (!isRevealed) {
      intervalRef.current = setInterval(() => {
        setDisplayText(generateGlitchText(children));
      }, speed);
    } else {
      setDisplayText(children);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [children, speed, glitchChars, isRevealed, revealDelay]);

  return (
    <span
      className={`font-mono transition-all duration-200 ${
        isRevealed
          ? "text-foreground"
          : "text-muted-foreground animate-pulse blur-[0.5px] drop-shadow-sm"
      } ${className}`}
      style={{
        textShadow: isRevealed ? "none" : undefined,
      }}
    >
      {displayText}
    </span>
  );
}
