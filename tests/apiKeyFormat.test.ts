import { describe, expect, it } from "vitest";
import {
  EXPIRY_OPTIONS,
  expiryOptionsFor,
  curlExample,
  formatDate,
  formatUsage,
} from "../src/utils/apiKeyFormat";

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

import { scopeLabels } from "../src/utils/apiKeyFormat";

describe("scopeLabels", () => {
  const options = [
    { path: "/sample", name: "샘플" },
    { path: "/stats", name: "통계" },
  ];
  it("path 를 앱 이름으로 바꿔 이어 붙인다", () => {
    expect(scopeLabels(["/sample", "/stats"], options)).toBe("샘플, 통계");
  });
  it("선택지에 없는 path 는 path 그대로 보여준다 (허용이 꺼진 앱)", () => {
    expect(scopeLabels(["/sample", "/gone"], options)).toBe("샘플, /gone");
  });
  it("빈 목록은 대시", () => {
    expect(scopeLabels([], options)).toBe("-");
  });
});

describe("expiryOptionsFor", () => {
  it("무기한 허용이면 전체 옵션", () => {
    expect(expiryOptionsFor(true)).toEqual(EXPIRY_OPTIONS);
  });
  it("무기한 불허(GUEST)면 무기한 옵션을 뺀다", () => {
    const opts = expiryOptionsFor(false);
    expect(opts.every((o) => o.days !== null)).toBe(true);
    expect(opts.length).toBe(EXPIRY_OPTIONS.length - 1);
  });
});
