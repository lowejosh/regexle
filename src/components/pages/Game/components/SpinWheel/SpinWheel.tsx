import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { useSpinWheel, calculateWheelSegmentData } from "./SpinWheel.hooks";
import { useSpinWheelStore } from "../../../../../store/spinWheelStore";
import { WHEEL_CONFIG } from "./SpinWheel.consts";
import { Button } from "@/components/ui/Button";

export function SpinWheel() {
  const { isSpinWheelOpen, closeSpinWheel, handleSpinResult } =
    useSpinWheelStore();
  const { isSpinning, rotation, selectedOption, handleSpin, resetWheel } =
    useSpinWheel();

  const handleClaimReward = () => {
    if (selectedOption) {
      handleSpinResult(selectedOption);
      resetWheel(); // Clear the selected option for next time
      closeSpinWheel();
    }
  };

  const createWheelSegments = () => {
    const segments = calculateWheelSegmentData();

    return segments.map(({ option, pathData, textX, textY, textRotation }) => (
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
    ));
  };

  return (
    <AnimatePresence>
      {isSpinWheelOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 !m-0"
          onClick={closeSpinWheel}
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
              onClick={closeSpinWheel}
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
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-md" />
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
                {!selectedOption ? (
                  <Button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    size="lg"
                    className="w-full"
                  >
                    {isSpinning ? "Spinning..." : "Spin the Wheel!"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleClaimReward}
                    size="lg"
                    className="w-full"
                  >
                    Claim Reward
                  </Button>
                )}

                <Button
                  onClick={closeSpinWheel}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
