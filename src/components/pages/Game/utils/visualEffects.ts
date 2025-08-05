const VIKING_TIMER = 10000; // 10 seconds
const COMIC_SANS_TIMER = 10000; // 10 seconds
const UPSIDE_DOWN_TIMER = 10000; // 10 seconds

export class VisualEffectsService {
  private static originalFontFamily: string | null = null;
  private static comicSansTimer: NodeJS.Timeout | null = null;
  private static vikingModeTimer: NodeJS.Timeout | null = null;
  private static upsideDownTimer: NodeJS.Timeout | null = null;
  private static originalTextContent: Map<Text, string> = new Map();

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

  static activateComicSansMode(): void {
    if (!this.originalFontFamily) {
      this.originalFontFamily =
        document.documentElement.style.fontFamily ||
        getComputedStyle(document.documentElement).fontFamily;
    }

    if (this.comicSansTimer) {
      clearTimeout(this.comicSansTimer);
    }

    document.documentElement.style.fontFamily =
      '"Comic Sans MS", "Comic Sans", cursive, sans-serif';

    this.comicSansTimer = setTimeout(() => {
      this.deactivateComicSansMode();
    }, COMIC_SANS_TIMER);
  }

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

  private static textToRunes(text: string): string {
    return text
      .split("")
      .map((char) => this.runeMap[char.toLowerCase()] || char)
      .join("");
  }

  static activateVikingMode(): void {
    if (this.vikingModeTimer) {
      clearTimeout(this.vikingModeTimer);
    }

    this.originalTextContent.clear();

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (
            parent &&
            (parent.tagName === "SCRIPT" || parent.tagName === "STYLE")
          ) {
            return NodeFilter.FILTER_REJECT;
          }
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

    textNodes.forEach((textNode) => {
      const originalContent = textNode.textContent || "";
      if (originalContent.trim()) {
        this.originalTextContent.set(textNode, originalContent);
        textNode.textContent = this.textToRunes(originalContent);
      }
    });

    document.documentElement.style.setProperty("--viking-bg", "#1a0d08");
    document.documentElement.style.setProperty("--viking-text", "#d4af37");
    document.documentElement.style.setProperty("--viking-accent", "#8b4513");

    document.body.style.backgroundColor = "var(--viking-bg)";
    document.body.style.color = "var(--viking-text)";
    document.body.style.fontFamily = '"Cinzel", "Times New Roman", serif';
    document.body.style.textShadow = "0 0 10px rgba(212, 175, 55, 0.3)";

    this.addRunicBackground();

    this.vikingModeTimer = setTimeout(() => {
      this.deactivateVikingMode();
    }, VIKING_TIMER);
  }

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

  static deactivateVikingMode(): void {
    this.originalTextContent.forEach((originalText, textNode) => {
      if (textNode.parentNode) {
        textNode.textContent = originalText;
      }
    });
    this.originalTextContent.clear();

    document.documentElement.style.removeProperty("--viking-bg");
    document.documentElement.style.removeProperty("--viking-text");
    document.documentElement.style.removeProperty("--viking-accent");

    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    document.body.style.fontFamily = "";
    document.body.style.textShadow = "";

    const bgDiv = document.getElementById("viking-bg");
    if (bgDiv) bgDiv.remove();

    if (this.vikingModeTimer) {
      clearTimeout(this.vikingModeTimer);
      this.vikingModeTimer = null;
    }
  }

  static activateUpsideDownMode(): void {
    if (this.upsideDownTimer) {
      clearTimeout(this.upsideDownTimer);
    }

    document.body.style.transform = "rotate(180deg)";
    document.body.style.transformOrigin = "center center";
    document.body.style.transition = "transform 1s ease-in-out";

    document.documentElement.style.setProperty("--upside-down-bg", "#1a1a2e");
    document.body.style.backgroundColor = "var(--upside-down-bg)";

    this.upsideDownTimer = setTimeout(() => {
      this.deactivateUpsideDownMode();
    }, UPSIDE_DOWN_TIMER);
  }

  static deactivateUpsideDownMode(): void {
    document.body.style.transform = "";
    document.body.style.transformOrigin = "";
    document.body.style.transition = "";
    document.body.style.backgroundColor = "";

    document.documentElement.style.removeProperty("--upside-down-bg");

    if (this.upsideDownTimer) {
      clearTimeout(this.upsideDownTimer);
      this.upsideDownTimer = null;
    }
  }

  static cleanup(): void {
    this.deactivateComicSansMode();
    this.deactivateVikingMode();
    this.deactivateUpsideDownMode();
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    VisualEffectsService.cleanup();
  });
}
