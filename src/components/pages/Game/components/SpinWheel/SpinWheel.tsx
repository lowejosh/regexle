import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WHEEL_OPTIONS, WHEEL_CONFIG } from "./SpinWheel.consts";
import type { WheelOption } from "./SpinWheel.consts";

interface SpinWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onResult?: (option: WheelOption) => void;
}

export function SpinWheel({ isOpen, onClose, onResult }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedOption, setSelectedOption] = useState<WheelOption | null>(
    null
  );

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedOption(null);

    // Calculate random rotation
    const minRotation = WHEEL_CONFIG.MIN_SPINS * 360;
    const maxRotation = WHEEL_CONFIG.MAX_SPINS * 360;
    const randomSpins =
      minRotation + Math.random() * (maxRotation - minRotation);

    // Add random offset within a segment
    const randomOffset = Math.random() * WHEEL_CONFIG.SEGMENT_ANGLE;
    const finalRotation = rotation + randomSpins + randomOffset;

    setRotation(finalRotation);

    // Calculate which option was selected
    setTimeout(() => {
      // The pointer is at 270 degrees (top of the wheel).
      // We need to find which segment is at this position after rotation.
      const normalizedRotation = ((finalRotation % 360) + 360) % 360;

      // Find the angle on the wheel that is now at the top
      const landingAngle = (360 - normalizedRotation + 270) % 360;

      // Calculate which segment the landing angle falls into
      const selectedIndex = Math.floor(
        landingAngle / WHEEL_CONFIG.SEGMENT_ANGLE
      );
      const selected = WHEEL_OPTIONS[selectedIndex];

      console.log("Final rotation:", finalRotation);
      console.log("Normalized rotation:", normalizedRotation);
      console.log("Landing Angle (at pointer):", landingAngle);
      console.log("Selected index:", selectedIndex);
      console.log("Selected option:", selected.label);

      setSelectedOption(selected);
      setIsSpinning(false);
      onResult?.(selected);
    }, WHEEL_CONFIG.SPIN_DURATION);
  };

  const createWheelSegments = () => {
    return WHEEL_OPTIONS.map((option, index) => {
      const startAngle = index * WHEEL_CONFIG.SEGMENT_ANGLE;
      const endAngle = startAngle + WHEEL_CONFIG.SEGMENT_ANGLE;

      // Create SVG path for segment
      const radius = WHEEL_CONFIG.WHEEL_SIZE / 2;
      const centerX = radius;
      const centerY = radius;

      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);

      const largeArcFlag = WHEEL_CONFIG.SEGMENT_ANGLE > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      // Calculate text position
      const textAngle = startAngle + WHEEL_CONFIG.SEGMENT_ANGLE / 2;
      const textAngleRad = (textAngle * Math.PI) / 180;
      const textRadius = radius * 0.5;
      const textX = centerX + textRadius * Math.cos(textAngleRad);
      const textY = centerY + textRadius * Math.sin(textAngleRad);

      // Determine text rotation to avoid upside-down text
      let textRotation = textAngle;
      if (textAngle > 90 && textAngle < 270) {
        // If text would be upside down, rotate it 180 degrees
        textRotation = textAngle + 180;
      }

      return (
        <g key={option.id}>
          <path
            d={pathData}
            fill={option.color}
            stroke="#ffffff"
            strokeWidth="2"
            className="transition-opacity hover:opacity-90"
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            className="pointer-events-none select-none"
            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
          >
            {option.label}
          </text>
        </g>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Spin the Wheel!</h2>

              <div className="relative flex justify-center">
                {/* Wheel */}
                <motion.div
                  animate={{ rotate: rotation }}
                  transition={{
                    duration: isSpinning
                      ? WHEEL_CONFIG.SPIN_DURATION / 1000
                      : 0,
                    ease: isSpinning ? [0.25, 0.46, 0.45, 0.94] : "linear",
                  }}
                  className="relative"
                >
                  <svg
                    width={WHEEL_CONFIG.WHEEL_SIZE}
                    height={WHEEL_CONFIG.WHEEL_SIZE}
                    className="drop-shadow-lg"
                  >
                    {createWheelSegments()}
                    {/* Center circle */}
                    <circle
                      cx={WHEEL_CONFIG.WHEEL_SIZE / 2}
                      cy={WHEEL_CONFIG.WHEEL_SIZE / 2}
                      r={WHEEL_CONFIG.CENTER_SIZE}
                      fill="#333"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </svg>
                </motion.div>

                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                  <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-md" />
                </div>
              </div>

              {selectedOption && !isSpinning && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <h3 className="font-bold text-green-800">You got:</h3>
                  <p className="text-green-700">{selectedOption.label}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  size="lg"
                  className="w-full"
                >
                  {isSpinning ? "Spinning..." : "Spin the Wheel!"}
                </Button>

                {selectedOption && !isSpinning && (
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full"
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
