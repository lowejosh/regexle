/**
 * Visual Effects Service
 * Handles temporary visual changes to the UI for spin wheel results
 */

export class VisualEffectsService {
  private static originalFontFamily: string | null = null;
  private static comicSansTimer: NodeJS.Timeout | null = null;

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
   * Cleanup method to stop all active effects
   */
  static cleanup(): void {
    this.deactivateComicSansMode();
  }
}

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    VisualEffectsService.cleanup();
  });
}
