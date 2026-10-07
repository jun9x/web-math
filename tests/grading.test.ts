import { describe, it, expect } from "vitest";
import {
  gradeMcqSingle,
  gradeMcqMulti,
  gradeNumeric,
  gradeExpression,
  gradeShortText,
  removeVietnameseAccents,
} from "../src/lib/grading";

describe("Grading System Unit Tests", () => {
  it("should grade mcq_single correctly", () => {
    const options = [
      { id: "opt1", is_correct: false, misconception_note: "Lỗi nhầm dấu" },
      { id: "opt2", is_correct: true },
    ];

    const resultCorrect = gradeMcqSingle("opt2", options, 1.0);
    expect(resultCorrect.is_correct).toBe(true);
    expect(resultCorrect.points_awarded).toBe(1.0);

    const resultWrong = gradeMcqSingle("opt1", options, 1.0);
    expect(resultWrong.is_correct).toBe(false);
    expect(resultWrong.points_awarded).toBe(0);
    expect(resultWrong.misconception_note).toBe("Lỗi nhầm dấu");
  });

  it("should grade numeric with Vietnamese comma and fraction formats", () => {
    // 3,14 matching 3.14
    const res1 = gradeNumeric("3,14", [3.14], 1e-3, 2.0);
    expect(res1.is_correct).toBe(true);
    expect(res1.points_awarded).toBe(2.0);

    // Fraction input 1/2 matching 0.5
    const res2 = gradeNumeric("1/2", [0.5], 1e-4, 1.0);
    expect(res2.is_correct).toBe(true);
    expect(res2.points_awarded).toBe(1.0);

    // Invalid numeric string
    const res3 = gradeNumeric("abc", [10], 1e-4, 1.0);
    expect(res3.is_correct).toBe(false);
    expect(res3.points_awarded).toBe(0);
    expect(res3.feedback_text).toContain("không hợp lệ");
  });

  it("should grade algebraic expression equivalence", () => {
    // 2*x + 3*x equivalent to 5*x
    const res1 = gradeExpression("2*x + 3*x", "5*x", ["x"]);
    expect(res1.is_correct).toBe(true);

    // (x + 1)^2 equivalent to x^2 + 2*x + 1
    const res2 = gradeExpression("(x + 1)^2", "x^2 + 2*x + 1", ["x"]);
    expect(res2.is_correct).toBe(true);

    // Non equivalent
    const res3 = gradeExpression("x + 2", "x + 3", ["x"]);
    expect(res3.is_correct).toBe(false);

    // Invalid expression syntax should not crash (no 500)
    const res4 = gradeExpression("x + +", "2*x", ["x"]);
    expect(res4.is_correct).toBe(false);
    expect(res4.feedback_text).toBe("Biểu thức Toán không hợp lệ.");
  });

  it("should grade short text with accent stripping and case insensitivity", () => {
    expect(removeVietnameseAccents("Hình Chữ Nhật")).toBe("Hinh Chu Nhat");

    const accepted = ["Hình chữ nhật", "hinh chu nhat"];
    const res = gradeShortText("hinh chu nhat", accepted, true, false);
    expect(res.is_correct).toBe(true);
  });
});
