/**
 * Text garbling utilities for creating partially corrupted text
 */

const GARBLE_CHARS = ["█", "▓", "▒", "░", "?", "*", "#", "@", "&", "%"];

/**
 * Garbles exactly half of the characters in a text string at random positions
 * Preserves spaces to maintain readability
 */
export function garbleText(text: string): string {
  const chars = text.split("");
  const numToGarble = Math.floor(chars.length / 2);

  const indexesToGarble = new Set<number>();
  while (indexesToGarble.size < numToGarble) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    // Don't garble spaces to maintain readability
    if (chars[randomIndex] !== " ") {
      indexesToGarble.add(randomIndex);
    }
  }

  indexesToGarble.forEach((index) => {
    chars[index] =
      GARBLE_CHARS[Math.floor(Math.random() * GARBLE_CHARS.length)];
  });

  return chars.join("");
}

/**
 * Garbles a percentage of characters in a text string
 */
export function garbleTextByPercentage(
  text: string,
  percentage: number = 0.5
): string {
  const chars = text.split("");
  const numToGarble = Math.floor(chars.length * percentage);

  const indexesToGarble = new Set<number>();
  while (indexesToGarble.size < numToGarble) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    if (chars[randomIndex] !== " ") {
      indexesToGarble.add(randomIndex);
    }
  }

  indexesToGarble.forEach((index) => {
    chars[index] =
      GARBLE_CHARS[Math.floor(Math.random() * GARBLE_CHARS.length)];
  });

  return chars.join("");
}
