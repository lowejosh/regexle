const VIKING_TIMER = 10000; // 10 seconds
const COMIC_SANS_TIMER = 10000; // 10 seconds
const UPSIDE_DOWN_TIMER = 10000; // 10 seconds

/**
 * Visual Effects Service
 * Handles temporary visual changes to the UI for spin wheel results
 */
export class VisualEffectsService {
  private static originalFontFamily: string | null = null;
  private static comicSansTimer: NodeJS.Timeout | null = null;
  private static vikingModeTimer: NodeJS.Timeout | null = null;
  private static upsideDownTimer: NodeJS.Timeout | null = null;
  private static originalTextContent: Map<Text, string> = new Map();

  /**
   * Character mapping for Nordic runes
   * Maps each letter to its corresponding Elder Futhark rune
   */
  private static runeMap: Record<string, string> = {
    a: "ᚨ",
    b: "ᛒ",
    c: "ᚲ",
    d: "ᛞ",
    e: "ᛖ",
    f: "ᚠ",
    g: "ᚷ",
    h: "ᚺ",
    i: "ᛁ",
    j: "ᛃ",
    k: "ᚲ",
    l: "ᛚ",
    m: "ᛗ",
    n: "ᚾ",
    o: "ᛟ",
    p: "ᛈ",
    q: "ᚲ",
    r: "ᚱ",
    s: "ᛊ",
    t: "ᛏ",
    u: "ᚢ",
    v: "ᚹ",
    w: "ᚹ",
    x: "ᛪ",
    y: "ᚤ",
    z: "ᛉ",
    A: "ᚨ",
    B: "ᛒ",
    C: "ᚲ",
    D: "ᛞ",
    E: "ᛖ",
    F: "ᚠ",
    G: "ᚷ",
    H: "ᚺ",
    I: "ᛁ",
    J: "ᛃ",
    K: "ᚲ",
    L: "ᛚ",
    M: "ᛗ",
    N: "ᚾ",
    O: "ᛟ",
    P: "ᛈ",
    Q: "ᚲ",
    R: "ᚱ",
    S: "ᛊ",
    T: "ᛏ",
    U: "ᚢ",
    V: "ᚹ",
    W: "ᚹ",
    X: "ᛪ",
    Y: "ᚤ",
    Z: "ᛉ",
    // Numbers and special chars remain the same
    "0": "᚜",
    "1": "ᛁ",
    "2": "ᛁᛁ",
    "3": "ᛁᛁᛁ",
    "4": "ᛁᚢ",
    "5": "ᚢ",
    "6": "ᚢᛁ",
    "7": "ᚢᛁᛁ",
    "8": "ᚢᛁᛁᛁ",
    "9": "ᚢᛁᚢ",
  };

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

    // Reset after 15 seconds
    this.comicSansTimer = setTimeout(() => {
      this.deactivateComicSansMode();
    }, COMIC_SANS_TIMER);
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
   * Converts text to Nordic runes
   */
  private static textToRunes(text: string): string {
    return text
      .split("")
      .map((char) => this.runeMap[char] || char)
      .join("");
  }

  /**
   * Activates Viking mode - transforms ALL text to Nordic runes
   */
  static activateVikingMode(): void {
    // Clear any existing timer
    if (this.vikingModeTimer) {
      clearTimeout(this.vikingModeTimer);
    }

    // Clear previous mappings if any
    this.originalTextContent.clear();

    // Find all text nodes in the document
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script and style elements
          const parent = node.parentElement;
          if (
            parent &&
            (parent.tagName === "SCRIPT" || parent.tagName === "STYLE")
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          // Only include text nodes with actual content
          return node.textContent && node.textContent.trim()
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      }
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    // Transform each text node to runes
    textNodes.forEach((textNode) => {
      const originalContent = textNode.textContent || "";
      if (originalContent.trim()) {
        // Store original content
        this.originalTextContent.set(textNode, originalContent);
        // Transform to runes
        textNode.textContent = this.textToRunes(originalContent);
      }
    });

    // Add Viking styling
    document.documentElement.style.setProperty("--viking-bg", "#1a0d08");
    document.documentElement.style.setProperty("--viking-text", "#d4af37");
    document.documentElement.style.setProperty("--viking-accent", "#8b4513");

    document.body.style.backgroundColor = "var(--viking-bg)";
    document.body.style.color = "var(--viking-text)";
    document.body.style.fontFamily = '"Cinzel", "Times New Roman", serif';
    document.body.style.textShadow = "0 0 10px rgba(212, 175, 55, 0.3)";

    // Add subtle background pattern
    this.addRunicBackground();

    // Reset after 30 seconds
    this.vikingModeTimer = setTimeout(() => {
      this.deactivateVikingMode();
    }, VIKING_TIMER);
  }

  /**
   * Adds a subtle runic background pattern
   */
  private static addRunicBackground(): void {
    const existingBg = document.getElementById("viking-bg");
    if (existingBg) existingBg.remove();

    const bgDiv = document.createElement("div");
    bgDiv.id = "viking-bg";
    bgDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.05;
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 50px,
        rgba(212, 175, 55, 0.1) 52px
      );
    `;
    document.body.appendChild(bgDiv);
  }

  /**
   * Deactivates Viking mode and restores all original text
   */
  static deactivateVikingMode(): void {
    // Restore all original text content
    this.originalTextContent.forEach((originalText, textNode) => {
      if (textNode.parentNode) {
        // Make sure node is still in DOM
        textNode.textContent = originalText;
      }
    });
    this.originalTextContent.clear();

    // Remove Viking styling
    document.documentElement.style.removeProperty("--viking-bg");
    document.documentElement.style.removeProperty("--viking-text");
    document.documentElement.style.removeProperty("--viking-accent");

    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    document.body.style.fontFamily = "";
    document.body.style.textShadow = "";

    // Remove background
    const bgDiv = document.getElementById("viking-bg");
    if (bgDiv) bgDiv.remove();

    if (this.vikingModeTimer) {
      clearTimeout(this.vikingModeTimer);
      this.vikingModeTimer = null;
    }
  }

  /**
   * Activates Upside Down mode - flips the entire page 180 degrees
   */
  static activateUpsideDownMode(): void {
    // Clear any existing timer
    if (this.upsideDownTimer) {
      clearTimeout(this.upsideDownTimer);
    }

    // Apply the upside down transform
    document.body.style.transform = "rotate(180deg)";
    document.body.style.transformOrigin = "center center";
    document.body.style.transition = "transform 1s ease-in-out";

    // Add some styling to make it more obvious
    document.documentElement.style.setProperty("--upside-down-bg", "#1a1a2e");
    document.body.style.backgroundColor = "var(--upside-down-bg)";

    // Reset after 25 seconds
    this.upsideDownTimer = setTimeout(() => {
      this.deactivateUpsideDownMode();
    }, UPSIDE_DOWN_TIMER);
  }

  /**
   * Deactivates Upside Down mode and restores normal orientation
   */
  static deactivateUpsideDownMode(): void {
    // Restore normal orientation
    document.body.style.transform = "";
    document.body.style.transformOrigin = "";
    document.body.style.transition = "";
    document.body.style.backgroundColor = "";

    // Remove styling
    document.documentElement.style.removeProperty("--upside-down-bg");

    if (this.upsideDownTimer) {
      clearTimeout(this.upsideDownTimer);
      this.upsideDownTimer = null;
    }
  }

  /**
   * Cleanup method to stop all active effects
   */
  static cleanup(): void {
    this.deactivateComicSansMode();
    this.deactivateVikingMode();
    this.deactivateUpsideDownMode();
  }
}

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    VisualEffectsService.cleanup();
  });
}
