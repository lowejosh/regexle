import { describe, it, expect } from "vitest";
import { cn, toTitleCase } from "../../lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("px-2", "py-4")).toBe("px-2 py-4");
    });

    it("should handle conflicting Tailwind classes", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
    });

    it("should handle conditional classes", () => {
      const isTrue = true;
      const isFalse = false;
      expect(cn("base-class", isTrue && "conditional-class")).toBe("base-class conditional-class");
      expect(cn("base-class", isFalse && "conditional-class")).toBe("base-class");
    });

    it("should handle undefined and null values", () => {
      expect(cn("base-class", undefined, null)).toBe("base-class");
    });

    it("should handle arrays of classes", () => {
      expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
    });

    it("should handle complex class merging with Tailwind conflicts", () => {
      expect(cn("bg-red-500", "bg-blue-500", "text-white")).toBe("bg-blue-500 text-white");
    });
  });

  describe("toTitleCase", () => {
    it("should convert lowercase string to title case", () => {
      expect(toTitleCase("hello")).toBe("Hello");
    });

    it("should convert uppercase string to title case", () => {
      expect(toTitleCase("HELLO")).toBe("Hello");
    });

    it("should convert mixed case string to title case", () => {
      expect(toTitleCase("hELLo")).toBe("Hello");
    });

    it("should handle empty string", () => {
      expect(toTitleCase("")).toBe("");
    });

    it("should handle single character", () => {
      expect(toTitleCase("a")).toBe("A");
      expect(toTitleCase("A")).toBe("A");
    });

    it("should handle strings with numbers and special characters", () => {
      expect(toTitleCase("hello123")).toBe("Hello123");
      expect(toTitleCase("hello-world")).toBe("Hello-world");
    });

    it("should handle whitespace", () => {
      expect(toTitleCase("  hello  ")).toBe("  hello  ");
    });
  });
});
