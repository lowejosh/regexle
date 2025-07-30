import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Gem, Sparkles, Eye, RefreshCw, Zap, Star, Sun, Moon } from "lucide-react";
import { useSpinWheelStore } from "../../../../../store/spinWheelStore";

interface TarotCard {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  meaning: string;
  reverseIcon: React.ComponentType<{ className?: string; size?: number }>;
}

const TAROT_CARDS: TarotCard[] = [
  {
    id: "the-fool",
    name: "The Fool",
    icon: Eye,
    meaning:
      "You go new place. No know what happen. Is okay. Fool always find way somehow.",
    reverseIcon: RefreshCw,
  },
  {
    id: "the-magician",
    name: "The Magician",
    icon: Sparkles,
    meaning:
      "You have stick and rock. Make fire with brain. Use hands, make thing happen.",
    reverseIcon: Zap,
  },
  {
    id: "the-hermit",
    name: "The Hermit",
    icon: Moon,
    meaning:
      "Sit in cave alone. Think deep thoughts. Answer come when belly not growling.",
    reverseIcon: Gem,
  },
  {
    id: "wheel-of-fortune",
    name: "Wheel of Fortune",
    icon: RefreshCw,
    meaning:
      "Big rock roll down hill. Sometimes crush foot, sometimes miss. Rock keep rolling.",
    reverseIcon: Sparkles,
  },
  {
    id: "the-tower",
    name: "The Tower",
    icon: Zap,
    meaning:
      "Tall thing fall down. Make loud noise. But now have materials to build better hut.",
    reverseIcon: Star,
  },
  {
    id: "the-star",
    name: "The Star",
    icon: Star,
    meaning:
      "Shiny dots in sky still there. Give hope when mammoth run away. Stars no judge.",
    reverseIcon: Moon,
  },
  {
    id: "the-sun",
    name: "The Sun",
    icon: Sun,
    meaning:
      "Big bright circle make warm. Good for dry meat and happy dance. Share fire with tribe.",
    reverseIcon: Sparkles,
  },
  {
    id: "death",
    name: "Death",
    icon: Moon,
    meaning:
      "Old thing go away. New thing come. Like when leaf fall, tree grow new ones.",
    reverseIcon: RefreshCw,
  },
];

export function TarotReading() {
  const { isTarotReadingActive, deactivateTarotReading } = useSpinWheelStore();
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showReading, setShowReading] = useState(false);

  useEffect(() => {
    if (isTarotReadingActive) {
      // Pick a random card when the tarot reading activates
      const randomCard =
        TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
      setSelectedCard(randomCard);
      setIsRevealed(false);
      setShowReading(true);
    } else {
      setShowReading(false);
      setIsRevealed(false);
      setSelectedCard(null);
    }
  }, [isTarotReadingActive]);

  const handleCardClick = () => {
    if (!isRevealed) {
      setIsRevealed(true);
    }
  };

  const handleClose = () => {
    setShowReading(false);
    deactivateTarotReading();
  };

  if (!showReading || !selectedCard) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 !m-0"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="bg-gradient-to-br from-orange-900 via-red-900 to-black p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-orange-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gem className="w-6 h-6 text-orange-300" />
              <h2 className="text-2xl font-bold text-orange-200">
                The Cards Speak
              </h2>
              <Gem className="w-6 h-6 text-orange-300" />
            </div>
            <p className="text-orange-300/80 text-sm mb-1">
              Click the card to reveal your destiny...
            </p>
          </div>

          <div className="relative mx-auto w-48 h-72 mb-6 perspective-1000">
            <motion.div
              className="relative w-full h-full cursor-pointer"
              onClick={handleCardClick}
              whileHover={{ scale: 1.05 }}
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: isRevealed ? 180 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {/* Card Back */}
              <div
                className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-red-900 via-orange-800 to-amber-900 border-2 border-orange-400/50 backface-hidden flex items-center justify-center overflow-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Geometric Pattern Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 200 300"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <defs>
                      <pattern
                        id="hexagons"
                        x="0"
                        y="0"
                        width="40"
                        height="46"
                        patternUnits="userSpaceOnUse"
                      >
                        <polygon
                          points="20,0 40,11.5 40,34.5 20,46 0,34.5 0,11.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.5"
                          className="text-orange-300"
                        />
                      </pattern>
                      <radialGradient id="centerGlow">
                        <stop
                          offset="0%"
                          stopColor="#fed7aa"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#fed7aa"
                          stopOpacity="0"
                        />
                      </radialGradient>
                    </defs>
                    <rect width="200" height="300" fill="url(#hexagons)" />
                    <circle cx="100" cy="150" r="80" fill="url(#centerGlow)" />
                  </svg>
                </div>

                <div className="text-center relative z-10">
                  <div className="mb-4 flex flex-col items-center space-y-2">
                    <Gem className="w-12 h-12 text-orange-200 drop-shadow-lg" />
                    <Sparkles className="w-8 h-8 text-orange-300 drop-shadow-lg" />
                    <Gem className="w-12 h-12 text-orange-200 drop-shadow-lg" />
                  </div>
                  <div className="text-orange-200 font-serif text-lg tracking-widest drop-shadow-md">
                    CAVEMAN
                  </div>
                  <div className="text-orange-300/70 text-xs tracking-wider">
                    TAROT
                  </div>
                </div>
              </div>

              {/* Card Front */}
              <div
                className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-orange-50 via-red-50 to-amber-100 border-2 border-orange-400/50 backface-hidden flex flex-col items-center justify-center p-4"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="absolute inset-0 opacity-5">
                  <svg className="w-full h-full" viewBox="0 0 200 300">
                    <pattern
                      id="stars"
                      x="0"
                      y="0"
                      width="50"
                      height="50"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx="25"
                        cy="25"
                        r="2"
                        fill="currentColor"
                        className="text-orange-600"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="1"
                        fill="currentColor"
                        className="text-orange-400"
                      />
                      <circle
                        cx="40"
                        cy="10"
                        r="1"
                        fill="currentColor"
                        className="text-orange-400"
                      />
                      <circle
                        cx="10"
                        cy="40"
                        r="1"
                        fill="currentColor"
                        className="text-orange-400"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="1"
                        fill="currentColor"
                        className="text-orange-400"
                      />
                    </pattern>
                    <rect width="200" height="300" fill="url(#stars)" />
                  </svg>
                </div>

                <div className="text-orange-600 mb-4 drop-shadow-md relative z-10 flex justify-center">
                  <selectedCard.icon size={64} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-orange-900 mb-2 text-center font-serif tracking-wide relative z-10">
                  {selectedCard.name}
                </h3>
                <div className="text-orange-600 drop-shadow-sm relative z-10 flex justify-center">
                  <selectedCard.reverseIcon size={32} className="text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-orange-800/20 to-red-800/20 rounded-lg p-4 mb-4 border border-orange-400/30 backdrop-blur-sm">
                  <p className="text-orange-100 text-sm leading-relaxed font-light">
                    {selectedCard.meaning}
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Accept Your Fate
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isRevealed && (
            <div className="text-center">
              <div className="animate-pulse text-orange-300/60 text-sm font-light flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Touch the card to reveal your destiny
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
