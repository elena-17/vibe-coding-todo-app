import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getDueDateStatus,
  getDueDateColorClass,
  formatDueDate,
  type DueDateStatus,
} from "./dueDateUtils";

describe("getDueDateStatus", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null when dueDate is null", () => {
    expect(getDueDateStatus(null)).toBeNull();
  });

  it("returns null when dueDate is undefined", () => {
    expect(getDueDateStatus(undefined)).toBeNull();
  });

  it("returns null for an invalid date string", () => {
    expect(getDueDateStatus("not-a-date")).toBeNull();
  });

  it("returns 'overdue' when due date is in the past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    expect(getDueDateStatus("2024-05-31T12:00:00Z")).toBe("overdue");
  });

  it("returns 'due-soon' when due date is within 24 hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    expect(getDueDateStatus("2024-06-02T10:00:00Z")).toBe("due-soon");
  });

  it("returns 'due-warning' when due date is between 24 and 72 hours away", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    expect(getDueDateStatus("2024-06-03T18:00:00Z")).toBe("due-warning");
  });

  it("returns 'on-track' when due date is more than 3 days away", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    expect(getDueDateStatus("2024-06-10T12:00:00Z")).toBe("on-track");
  });

  it("returns 'due-soon' when due date is exactly now", () => {
    vi.useFakeTimers();
    const now = new Date("2024-06-01T12:00:00Z");
    vi.setSystemTime(now);
    // Same millisecond is not < now, so due-soon (0 hours left <= 24)
    expect(getDueDateStatus("2024-06-01T12:00:00Z")).toBe("due-soon");
  });
});

describe("getDueDateColorClass", () => {
  it("returns red class for overdue", () => {
    expect(getDueDateColorClass("overdue")).toBe("text-red-600");
  });

  it("returns orange class for due-soon", () => {
    expect(getDueDateColorClass("due-soon")).toBe("text-orange-500");
  });

  it("returns yellow class for due-warning", () => {
    expect(getDueDateColorClass("due-warning")).toBe("text-yellow-500");
  });

  it("returns green class for on-track", () => {
    expect(getDueDateColorClass("on-track")).toBe("text-green-600");
  });

  it("returns slate class for null status", () => {
    expect(getDueDateColorClass(null)).toBe("text-slate-500");
  });
});

describe("formatDueDate", () => {
  it("formats a valid ISO date string", () => {
    const result = formatDueDate("2024-06-15T10:30:00Z");
    expect(result).toContain("2024");
    expect(result).toContain("Jun");
    expect(result).toContain("15");
  });

  it("returns the original string for an invalid date", () => {
    expect(formatDueDate("not-a-date")).toBe("not-a-date");
  });
});
