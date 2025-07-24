import { useState } from "react";
import { WHEEL_OPTIONS, WHEEL_CONFIG } from "./SpinWheel.consts";
import type { WheelOption } from "./SpinWheel.consts";

export function useSpinWheel() {
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
      const normalizedRotation = ((finalRotation % 360) + 360) % 360;
      const landingAngle = (360 - normalizedRotation + 270) % 360;
      const selectedIndex = Math.floor(
        landingAngle / WHEEL_CONFIG.SEGMENT_ANGLE
      );
      const selected = WHEEL_OPTIONS[selectedIndex];

      setSelectedOption(selected);
      setIsSpinning(false);
      // Remove the automatic onResult call
    }, WHEEL_CONFIG.SPIN_DURATION);
  };

  const resetWheel = () => {
    setIsSpinning(false);
    setSelectedOption(null);
    setRotation(0);
  };

  return {
    isSpinning,
    rotation,
    selectedOption,
    handleSpin,
    resetWheel,
  };
}

export function calculateWheelSegmentData() {
  return WHEEL_OPTIONS.map((option, index) => {
    const startAngle = index * WHEEL_CONFIG.SEGMENT_ANGLE;
    const endAngle = startAngle + WHEEL_CONFIG.SEGMENT_ANGLE;

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

    // text position
    const textAngle = startAngle + WHEEL_CONFIG.SEGMENT_ANGLE / 2;
    const textAngleRad = (textAngle * Math.PI) / 180;
    const textRadius = radius * 0.5;
    const textX = centerX + textRadius * Math.cos(textAngleRad);
    const textY = centerY + textRadius * Math.sin(textAngleRad);

    // text rotation to avoid upside-down text
    let textRotation = textAngle;
    if (textAngle > 90 && textAngle < 270) {
      // if we're upside down, rotate text 180 degrees
      textRotation = textAngle + 180;
    }

    return {
      option,
      pathData,
      textX,
      textY,
      textRotation,
    };
  });
}
