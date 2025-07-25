import { useState, useEffect } from "react";
import { RubberDuckService } from "../utils/rubberDuckService";

/**
 * Custom hook to manage rubber duck state
 */
export function useRubberDuck() {
  const [isVisible, setIsVisible] = useState(
    RubberDuckService.isRubberDuckActive
  );

  useEffect(() => {
    const handleStateChange = () => {
      setIsVisible(RubberDuckService.isRubberDuckActive);
    };

    RubberDuckService.addListener(handleStateChange);

    return () => {
      RubberDuckService.removeListener(handleStateChange);
    };
  }, []);

  const hideDuck = () => {
    RubberDuckService.deactivate();
  };

  return {
    isVisible,
    hideDuck,
  };
}
