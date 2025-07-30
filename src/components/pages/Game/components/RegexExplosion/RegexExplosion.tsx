import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../../../../store/gameStore";

const EXPLOSION_EMOJIS = ["💥", "🎆", "✨", "🎊", "💫", "⭐", "🌟", "💖", "🔥", "⚡", "🌈", "🎉", "🎯", "💯", "🚀", "⭐", "🌠", "💥"];

export function RegexExplosion() {
  const { showRegexExplosion, clearRegexExplosion } = useGameStore();

  useEffect(() => {
    if (showRegexExplosion) {
      const timer = setTimeout(() => {
        clearRegexExplosion();
      }, 5000); // Extended to 5 seconds for maximum obnoxiousness

      return () => clearTimeout(timer);
    }
  }, [showRegexExplosion, clearRegexExplosion]);

  return createPortal(
    <AnimatePresence>
      {showRegexExplosion && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Enhanced screen shake background with color flash */}
          <motion.div
            className="absolute bg-gradient-to-r from-red-500/30 via-orange-500/30 to-yellow-500/30"
            style={{
              width: 'calc(100vw + 40px)',
              height: 'calc(100vh + 40px)',
              top: '-20px',
              left: '-20px',
            }}
            animate={{
              x: [0, -15, 15, -12, 12, -8, 8, -5, 5, 0],
              y: [0, -12, 12, -8, 8, -5, 5, -3, 3, 0],
              backgroundColor: [
                "rgba(239, 68, 68, 0.3)",
                "rgba(249, 115, 22, 0.4)", 
                "rgba(234, 179, 8, 0.3)",
                "rgba(249, 115, 22, 0.4)",
                "rgba(239, 68, 68, 0.3)",
              ]
            }}
            transition={{
              x: { duration: 0.4, repeat: 4, ease: "easeInOut" },
              y: { duration: 0.4, repeat: 4, ease: "easeInOut" },
              backgroundColor: { duration: 0.3, repeat: 8, ease: "easeInOut" }
            }}
          />

          {/* Main explosion message - perfectly centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white rounded-3xl border-8 border-white shadow-2xl text-center transform"
              initial={{ scale: 0, rotate: -360 }}
              animate={{ 
                scale: [0, 1.3, 0.9, 1.1, 1], 
                rotate: [360, 0, 10, -10, 5, -5, 0],
              }}
              transition={{
                scale: { duration: 1, ease: "easeOut" },
                rotate: { duration: 1.2, ease: "easeInOut" },
              }}
              style={{
                filter: "drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 80px",
                minHeight: "350px",
                minWidth: "600px",
              }}
            >
              {/* Pulsing background glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Main text - perfectly centered */}
              <motion.h1 
                className="relative text-8xl md:text-9xl lg:text-10xl font-black tracking-wider"
                animate={{
                  textShadow: [
                    "0 0 30px #ff0000, 0 0 60px #ff0000",
                    "0 0 50px #ff6600, 0 0 80px #ff6600", 
                    "0 0 70px #ffff00, 0 0 100px #ffff00",
                    "0 0 50px #ff6600, 0 0 80px #ff6600",
                    "0 0 30px #ff0000, 0 0 60px #ff0000",
                  ],
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  textShadow: { duration: 1.5, repeat: Infinity },
                  scale: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                  WebkitTextStroke: "4px white",
                  filter: "drop-shadow(4px 4px 8px rgba(0,0,0,0.8))",
                }}
              >
                YOU SUCK!
              </motion.h1>
              
              {/* Spinning explosion emoji */}
              <motion.div
                className="relative text-8xl mt-6"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.3, 1],
                }}
                transition={{ 
                  rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                💥
              </motion.div>
            </motion.div>
          </div>

          {/* Extra obnoxious floating particles */}
          {Array.from({ length: 30 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl"
              initial={{ x: "50vw", y: "50vh", scale: 0, rotate: 0 }}
              animate={{
                x: `${Math.random() * 120 - 10}vw`,
                y: `${Math.random() * 120 - 10}vh`,
                scale: [0, Math.random() * 2 + 1, 0],
                rotate: [0, 360 * (Math.random() > 0.5 ? 3 : -3)],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 1,
                ease: "easeOut",
              }}
            >
              {EXPLOSION_EMOJIS[Math.floor(Math.random() * EXPLOSION_EMOJIS.length)]}
            </motion.div>
          ))}
          
          {/* Extra annoying spinning emojis */}
          {Array.from({ length: 15 }, (_, i) => (
            <motion.div
              key={`spin-${i}`}
              className="absolute text-4xl"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.5, 1],
              }}
              transition={{
                rotate: { duration: Math.random() * 2 + 1, repeat: Infinity, ease: "linear" },
                scale: { duration: Math.random() * 1 + 0.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {["💀", "😵", "🤯", "😭", "💩", "🤮"][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}

          {/* Enhanced confetti burst with more colors */}
          <motion.div className="absolute inset-0">
            {Array.from({ length: 80 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  backgroundColor: [
                    "#ff0000", "#ff6600", "#ffff00", "#ff3366", "#ff9933", 
                    "#ff1493", "#00ff00", "#ff4500", "#ffd700", "#dc143c"
                  ][i % 10],
                  left: "50%",
                  top: "50%",
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, Math.random() * 2 + 1, 0],
                  x: `${(Math.random() - 0.5) * 300}vw`,
                  y: `${(Math.random() - 0.5) * 300}vh`,
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: Math.random() * 2 + 1.5,
                  delay: Math.random() * 0.8,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
