import { describe, expect, it } from "vitest";

import { cn } from "../cn";

describe("cn function", () => {
  it("should return a single class name correctly", () => {
    const result = cn("bg-blue-500");
    expect(result).toBe("bg-blue-500");
  });

  it("should merge multiple class names correctly", () => {
    const result = cn("bg-blue-500", "text-white");
    expect(result).toBe("bg-blue-500 text-white");
  });

  it("should remove duplicate class names", () => {
    const result = cn("bg-blue-500", "bg-blue-500");
    expect(result).toBe("bg-blue-500");
  });

  it("should handle conditional classes correctly", () => {
    const condition = true;
    const result = cn("bg-blue-500", condition && "text-white");
    expect(result).toBe("bg-blue-500 text-white");
  });

  it("should ignore falsy values like undefined or null", () => {
    const result = cn("bg-blue-500", undefined, "text-white", null);
    expect(result).toBe("bg-blue-500 text-white");
  });

  it("should merge classes from tailwind-merge properly", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500"); // tailwind-merge should prioritize the last valid class
  });

  it("should handle empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });
});
