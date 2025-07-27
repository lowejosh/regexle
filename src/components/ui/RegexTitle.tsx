import { useState, useEffect } from "react";
import { GlitchText } from "./GlitchText";

// Constants
const REGEX_PATTERNS = [
  "/^Regexle$/",
  "/Reg[ex]+le/i",
  "/R.*e/g",
  "/(Regex|le)+/",
] as const;

const TIMING = {
  MIN_DELAY: 4000, // 4 seconds
  MAX_DELAY: 12000, // 12 seconds
  GLITCH_OUT: 150,
  SHOW_PATTERN: 1000,
  GLITCH_BACK: 1150,
} as const;

interface RegexTitleProps {
  className?: string;
}

export function RegexTitle({ className = "" }: RegexTitleProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [currentPattern, setCurrentPattern] = useState("");

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    const getRandomPattern = () => {
      return REGEX_PATTERNS[Math.floor(Math.random() * REGEX_PATTERNS.length)];
    };

    const getRandomDelay = () => {
      return (
        TIMING.MIN_DELAY + Math.random() * (TIMING.MAX_DELAY - TIMING.MIN_DELAY)
      );
    };

    const executeGlitchSequence = () => {
      setCurrentPattern(getRandomPattern());
      setIsGlitching(true);

      timeoutIds.push(
        setTimeout(() => {
          setIsGlitching(false);
          setShowPattern(true);
        }, TIMING.GLITCH_OUT)
      );

      timeoutIds.push(
        setTimeout(() => {
          setIsGlitching(true);
          setShowPattern(false);
        }, TIMING.SHOW_PATTERN)
      );

      timeoutIds.push(
        setTimeout(() => {
          setIsGlitching(false);
          scheduleNextGlitch();
        }, TIMING.GLITCH_BACK)
      );
    };

    const scheduleNextGlitch = () => {
      const delay = getRandomDelay();
      timeoutIds.push(setTimeout(executeGlitchSequence, delay));
    };

    // Start the cycle
    scheduleNextGlitch();

    // Cleanup
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-wide text-primary group-hover:text-primary/80 transition-colors">
        <span className="relative">
          {/* Main text - normal, glitching, or showing pattern */}
          {isGlitching ? (
            <GlitchText speed={50} className="text-primary/80">
              Regexle
            </GlitchText>
          ) : showPattern ? (
            <span className="text-primary/80">{currentPattern}</span>
          ) : (
            <span className="text-primary">Regexle</span>
          )}
        </span>
      </h1>
    </div>
  );
}
