/**
 * Visual Effects Service
 * Handles temporary visual changes to the UI for spin wheel results
 */

export class VisualEffectsService {
  private static originalFontFamily: string | null = null;
  private static comicSansTimer: NodeJS.Timeout | null = null;
  private static discoTimer: NodeJS.Timeout | null = null;

  /**
   * Activates Comic Sans mode for the entire document for 30 seconds
   */
  static activateComicSansMode(): void {
    // Store original font family if not already stored
    if (!this.originalFontFamily) {
      this.originalFontFamily =
        document.documentElement.style.fontFamily ||
        getComputedStyle(document.documentElement).fontFamily;
    }

    // Clear any existing timer
    if (this.comicSansTimer) {
      clearTimeout(this.comicSansTimer);
    }

    // Apply Comic Sans to the entire document
    document.documentElement.style.fontFamily =
      '"Comic Sans MS", "Comic Sans", cursive, sans-serif';

    // Reset after 30 seconds
    this.comicSansTimer = setTimeout(() => {
      this.deactivateComicSansMode();
    }, 30000);
  }

  /**
   * Deactivates Comic Sans mode and restores original font
   */
  static deactivateComicSansMode(): void {
    if (this.originalFontFamily) {
      document.documentElement.style.fontFamily = this.originalFontFamily;
    } else {
      document.documentElement.style.fontFamily = "";
    }

    if (this.comicSansTimer) {
      clearTimeout(this.comicSansTimer);
      this.comicSansTimer = null;
    }
  }

  /**
   * Activates disco mode with color-changing background for 10 seconds
   */
  static activateDiscoMode(): void {
    // Clear any existing timer
    if (this.discoTimer) {
      clearTimeout(this.discoTimer);
    }

    const body = document.body;
    const originalBackground = body.style.background || "";

    const discoColors = [
      "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
      "linear-gradient(45deg, #45b7d1, #96ceb4)",
      "linear-gradient(45deg, #ffa07a, #98d8c8)",
      "linear-gradient(45deg, #f1c40f, #e74c3c)",
      "linear-gradient(45deg, #9b59b6, #3498db)",
      "linear-gradient(45deg, #e67e22, #2ecc71)",
    ];

    let colorIndex = 0;
    const changeInterval = 200; // Change color every 200ms
    const duration = 10000; // 10 seconds total

    // Function to change colors
    const changeColor = () => {
      body.style.background = discoColors[colorIndex];
      body.style.transition = "background 0.2s ease-in-out";
      colorIndex = (colorIndex + 1) % discoColors.length;
    };

    // Start the disco
    const discoInterval = setInterval(changeColor, changeInterval);

    // Stop after duration
    this.discoTimer = setTimeout(() => {
      clearInterval(discoInterval);
      body.style.background = originalBackground;
      body.style.transition = "";
      this.discoTimer = null;
    }, duration);
  }

  /**
   * Cleanup method to stop all active effects
   */
  static cleanup(): void {
    this.deactivateComicSansMode();

    if (this.discoTimer) {
      clearTimeout(this.discoTimer);
      this.discoTimer = null;
      document.body.style.background = "";
      document.body.style.transition = "";
    }
  }
}

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    VisualEffectsService.cleanup();
  });
}
