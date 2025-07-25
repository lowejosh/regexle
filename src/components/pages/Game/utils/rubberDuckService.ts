/**
 * Rubber Duck Service
 * Manages the rubber duck debugging experience
 */

type DuckEventListener = () => void;

export class RubberDuckService {
  private static isActive = false;
  private static listeners: Set<DuckEventListener> = new Set();

  /**
   * Activates the rubber duck debugging experience
   */
  static activate(): void {
    if (this.isActive) {
      return; // Duck is already active
    }

    this.isActive = true;
    this.notifyListeners();

    console.log(
      "🦆 Rubber duck debugging activated! A rubber duck has appeared to help you think through your regex problem."
    );
  }

  /**
   * Deactivates the rubber duck
   */
  static deactivate(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    this.notifyListeners();
  }

  /**
   * Returns whether the duck is currently active
   */
  static get isRubberDuckActive(): boolean {
    return this.isActive;
  }

  /**
   * Add a listener for duck state changes
   */
  static addListener(listener: DuckEventListener): void {
    this.listeners.add(listener);
  }

  /**
   * Remove a listener for duck state changes
   */
  static removeListener(listener: DuckEventListener): void {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private static notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Cleanup method to deactivate duck
   */
  static cleanup(): void {
    this.deactivate();
    this.listeners.clear();
  }
}

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    RubberDuckService.cleanup();
  });
}
