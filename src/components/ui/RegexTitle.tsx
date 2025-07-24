import { useState, useEffect } from "react";
import { GlitchText } from "./GlitchText";

interface RegexTitleProps {
  className?: string;
}

export function RegexTitle({ className = "" }: RegexTitleProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [currentPattern, setCurrentPattern] = useState("");

  useEffect(() => {
    const patterns = [
      "/^Regexle$/",
      "/Reg[ex]+le/i",
      "/R.*e/g",
      "/(Regex|le)+/",
    ];

    const scheduleNextGlitch = () => {
      // Random interval between 15-45 seconds
      const randomDelay = 15000 + Math.random() * 30000;

      setTimeout(() => {
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        setCurrentPattern(pattern);

        // Phase 1: Glitch transition out
        setIsGlitching(true);

        setTimeout(() => {
          // Phase 2: Show actual pattern
          setIsGlitching(false);
          setShowPattern(true);
        }, 150);

        setTimeout(() => {
          // Phase 3: Glitch transition back
          setIsGlitching(true);
          setShowPattern(false);
        }, 1000);

        setTimeout(() => {
          // Phase 4: Back to normal
          setIsGlitching(false);
          // Schedule the next glitch
          scheduleNextGlitch();
        }, 1150);
      }, randomDelay);
    };

    // Start the first glitch cycle
    scheduleNextGlitch();

    // No cleanup needed since we're using setTimeout chains
    return () => {};
  }, []);
  return (
    <div className={`relative ${className}`}>
      <h1 className="text-2xl font-bold font-mono tracking-wide text-primary group-hover:text-primary/80 transition-colors">
        <span className="relative">
          {/* Main text - normal, glitching, or showing pattern */}
          {isGlitching ? (
            <GlitchText speed={50} className="text-orange-400">
              Regexle
            </GlitchText>
          ) : showPattern ? (
            <span className="text-orange-400 animate-pulse">
              {currentPattern}
            </span>
          ) : (
            <>
              <span className="text-primary">Reg</span>
              <span className="text-orange-500">ex</span>
              <span className="text-primary">le</span>
            </>
          )}
        </span>
      </h1>
    </div>
  );
}
