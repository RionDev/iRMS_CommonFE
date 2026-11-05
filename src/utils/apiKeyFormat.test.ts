import { describe, expect, it } from "vitest";
import {
  EXPIRY_OPTIONS,
  curlExample,
  formatDate,
  formatUsage,
} from "./apiKeyFormat";

describe("formatUsage", () => {
  it("천 단위 구분과 한도를 보여준다", () => {
    expect(formatUsage(1234, 5000)).toBe("1,234 / 5,000");
  });
  it("한도를 넘은 값은 한도로 캡한다", () => {
    expect(formatUsage(5312, 5000)).toBe("5,000 / 5,000");
  });
  it("0 도 그대로", () => {
    expect(formatUsage(0, 60)).toBe("0 / 60");
  });
});

describe("formatDate", () => {
  it("ISO 를 YYYY-MM-DD 로", () => {
    expect(formatDate("2026-12-05T10:20:30")).toBe("2026-12-05");
  });
  it("null 은 기본 문구", () => {
    expect(formatDate(null)).toBe("없음");
    expect(formatDate(null, "무기한")).toBe("무기한");
  });
});

describe("EXPIRY_OPTIONS", () => {
  it("30/90/180일과 무기한", () => {
    expect(EXPIRY_OPTIONS.map((o) => o.days)).toEqual([30, 90, 180, null]);
  });
});

describe("curlExample", () => {
  it("키가 없으면 placeholder", () => {
    expect(curlExample("https://irms.example")).toBe(
      'curl -H "X-API-Key: <키>" https://irms.example/api/sample/samples',
    );
  });
  it("키가 있으면 그대로 넣는다", () => {
    expect(curlExample("http://localhost", "irms_abc")).toContain("X-API-Key: irms_abc");
  });
});
