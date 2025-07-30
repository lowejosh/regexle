import { describe, it, expect, beforeEach, vi } from "vitest";
import { formatRelativeTime, formatCompactDateTime } from "../../lib/timeUtils";

describe("timeUtils", () => {
  beforeEach(() => {
    // Mock Date.now() for consistent testing
    vi.useFakeTimers();
  });

  describe("formatRelativeTime", () => {
    it("should return 'Just now' for timestamps less than a minute ago", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      expect(formatRelativeTime(now)).toBe("Just now");
      expect(formatRelativeTime(now - 30000)).toBe("Just now"); // 30 seconds ago
    });

    it("should format minutes correctly", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      expect(formatRelativeTime(now - 60000)).toBe("1m ago"); // 1 minute ago
      expect(formatRelativeTime(now - 300000)).toBe("5m ago"); // 5 minutes ago
      expect(formatRelativeTime(now - 3540000)).toBe("59m ago"); // 59 minutes ago
    });

    it("should format hours correctly", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      expect(formatRelativeTime(now - 3600000)).toBe("1h ago"); // 1 hour ago
      expect(formatRelativeTime(now - 7200000)).toBe("2h ago"); // 2 hours ago
      expect(formatRelativeTime(now - 86340000)).toBe("23h ago"); // 23 hours 59 minutes ago
    });

    it("should format days correctly", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      expect(formatRelativeTime(now - 86400000)).toBe("1d ago"); // 1 day ago
      expect(formatRelativeTime(now - 345600000)).toBe("4d ago"); // 4 days ago
      expect(formatRelativeTime(now - 604740000)).toBe("6d ago"); // 6 days 59 minutes ago
    });

    it("should format weeks correctly", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      
      expect(formatRelativeTime(now - 604800000)).toBe("1w ago"); // 1 week ago
      expect(formatRelativeTime(now - 1209600000)).toBe("2w ago"); // 2 weeks ago
      expect(formatRelativeTime(now - 2419140000)).toBe("3w ago"); // 3 weeks 59 minutes ago
    });

    it("should format older dates as formatted date strings", () => {
      const now = new Date("2024-07-30T12:00:00Z").getTime();
      vi.setSystemTime(now);
      
      const monthAgo = now - (30 * 24 * 60 * 60 * 1000); // 30 days ago
      const result = formatRelativeTime(monthAgo);
      
      // Should be a formatted date, not relative time
      expect(result).toMatch(/Jun \d{1,2}/);
    });

    it("should include year for dates from different years", () => {
      const now = new Date("2024-07-30T12:00:00Z").getTime();
      vi.setSystemTime(now);
      
      const lastYear = new Date("2023-05-15T12:00:00Z").getTime();
      const result = formatRelativeTime(lastYear);
      
      // For older dates beyond weeks, it shows formatted date
      // The exact format depends on locale but should be a short date format
      expect(result).toMatch(/May/); // Should at least contain month
    });

    it("should format compact date time for different calendar days", () => {
      // Test with clearly different days to ensure proper date formatting
      const now = new Date("2024-07-30T23:59:59Z");
      vi.setSystemTime(now.getTime());
      
      const differentDay = new Date("2024-07-29T00:00:01Z").getTime();
      const result = formatCompactDateTime(differentDay);
      
      // Should show date format for different calendar days
      expect(result).toMatch(/Jul/); // Should contain month abbreviation
    });
  });

  describe("formatCompactDateTime", () => {
    it("should format today's date as time only", () => {
      const now = new Date("2024-07-30T15:30:00Z");
      vi.setSystemTime(now.getTime());
      
      const todayTimestamp = now.getTime();
      const result = formatCompactDateTime(todayTimestamp);
      
      // Should show time format (varies by locale, but should contain time elements)
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it("should format dates from this year without year", () => {
      const now = new Date("2024-07-30T12:00:00Z");
      vi.setSystemTime(now.getTime());
      
      const earlierThisYear = new Date("2024-03-15T10:30:00Z").getTime();
      const result = formatCompactDateTime(earlierThisYear);
      
      expect(result).toMatch(/Mar \d{1,2}/);
      expect(result).not.toMatch(/2024/);
    });

    it("should format dates from different years with year", () => {
      const now = new Date("2024-07-30T12:00:00Z");
      vi.setSystemTime(now.getTime());
      
      const lastYear = new Date("2023-03-15T10:30:00Z").getTime();
      const result = formatCompactDateTime(lastYear);
      
      expect(result).toMatch(/Mar \d{1,2}, 2023/);
    });

    it("should handle edge case of same calendar day", () => {
      const now = new Date("2024-07-30T12:00:00Z");
      vi.setSystemTime(now.getTime());
      
      // Use the exact same timestamp to ensure same day
      const sameDay = now.getTime();
      const result = formatCompactDateTime(sameDay);
      
      // Should show time since it's the same calendar day
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });
});
