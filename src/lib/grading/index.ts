import { evaluate, parse, isNode } from "mathjs";

export interface QuestionAnswerConfig {
  accepted_values?: (string | number)[];
  tolerance?: number; // absolute or relative tolerance
  variables?: string[]; // variables used in expression e.g. ["x", "y"]
  case_sensitive?: boolean;
  ignore_accents?: boolean;
}

export interface Option {
  id: string;
  is_correct?: boolean;
  misconception_note?: string | null;
}

export interface GradeResult {
  is_correct: boolean;
  points_awarded: number;
  max_points: number;
  feedback_text?: string;
  misconception_note?: string;
}

/**
 * Remove Vietnamese accents for short text matching if enabled.
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/**
 * Grade Multiple Choice Single (mcq_single) or True/False (true_false)
 */
export function gradeMcqSingle(
  selectedOptionId: string,
  options: Option[],
  maxPoints: number = 1.0
): GradeResult {
  const selected = options.find((opt) => opt.id === selectedOptionId);
  const isCorrect = Boolean(selected?.is_correct);

  return {
    is_correct: isCorrect,
    points_awarded: isCorrect ? maxPoints : 0,
    max_points: maxPoints,
    misconception_note: selected?.misconception_note || undefined,
  };
}

/**
 * Grade Multiple Choice Multi (mcq_multi)
 */
export function gradeMcqMulti(
  selectedOptionIds: string[],
  options: Option[],
  maxPoints: number = 1.0
): GradeResult {
  const correctOptionIds = options
    .filter((opt) => opt.is_correct)
    .map((opt) => opt.id);

  const selectedSet = new Set(selectedOptionIds);
  const correctSet = new Set(correctOptionIds);

  const isExactMatch =
    selectedSet.size === correctSet.size &&
    [...selectedSet].every((id) => correctSet.has(id));

  // Find any misconception notes for incorrectly selected options
  const chosenIncorrectOptions = options.filter(
    (opt) => selectedSet.has(opt.id) && !opt.is_correct
  );
  const misconceptionNote = chosenIncorrectOptions
    .map((opt) => opt.misconception_note)
    .filter(Boolean)
    .join(" ");

  // Partial credit calculation
  let points = 0;
  if (isExactMatch) {
    points = maxPoints;
  } else {
    // Fraction of correct choices selected minus incorrect choices
    let matches = 0;
    selectedSet.forEach((id) => {
      if (correctSet.has(id)) matches++;
      else matches--;
    });
    points = Math.max(0, (matches / correctSet.size) * maxPoints);
  }

  return {
    is_correct: isExactMatch,
    points_awarded: Number(points.toFixed(2)),
    max_points: maxPoints,
    misconception_note: misconceptionNote || undefined,
  };
}

/**
 * Grade Numeric input (numeric)
 * Supports VN comma format e.g. "3,14" -> "3.14" and fraction strings "1/2".
 */
export function gradeNumeric(
  userResponse: string,
  acceptedValues: (string | number)[],
  tolerance: number = 1e-5,
  maxPoints: number = 1.0
): GradeResult {
  if (!userResponse || typeof userResponse !== "string") {
    return { is_correct: false, points_awarded: 0, max_points: maxPoints };
  }

  const cleanResponse = userResponse.trim().replace(",", ".");

  let userVal: number;
  try {
    const evaluated = evaluate(cleanResponse);
    userVal = typeof evaluated === "number" ? evaluated : parseFloat(evaluated);
  } catch {
    userVal = parseFloat(cleanResponse);
  }

  if (isNaN(userVal)) {
    return {
      is_correct: false,
      points_awarded: 0,
      max_points: maxPoints,
      feedback_text: "Định dạng số không hợp lệ.",
    };
  }

  let isCorrect = false;
  for (const accepted of acceptedValues) {
    let targetVal: number;
    if (typeof accepted === "number") {
      targetVal = accepted;
    } else {
      const cleanAccepted = String(accepted).trim().replace(",", ".");
      try {
        targetVal = evaluate(cleanAccepted);
      } catch {
        targetVal = parseFloat(cleanAccepted);
      }
    }

    if (!isNaN(targetVal)) {
      if (Math.abs(userVal - targetVal) <= tolerance) {
        isCorrect = true;
        break;
      }
    }
  }

  return {
    is_correct: isCorrect,
    points_awarded: isCorrect ? maxPoints : 0,
    max_points: maxPoints,
  };
}

/**
 * Grade Expression equivalence using mathjs sampling evaluation (10 random sample points).
 */
export function gradeExpression(
  userExpression: string,
  targetExpression: string,
  variables: string[] = ["x"],
  maxPoints: number = 1.0
): GradeResult {
  if (!userExpression || !targetExpression) {
    return { is_correct: false, points_awarded: 0, max_points: maxPoints };
  }

  const cleanUser = userExpression.trim().replace(",", ".");
  const cleanTarget = targetExpression.trim().replace(",", ".");

  try {
    const userNode = parse(cleanUser);
    const targetNode = parse(cleanTarget);

    let matchCount = 0;
    const totalSamples = 10;

    for (let i = 0; i < totalSamples; i++) {
      const scope: Record<string, number> = {};
      variables.forEach((v) => {
        // Generate non-zero random sample value between 0.5 and 10.5
        scope[v] = Math.random() * 10 + 0.5;
      });

      try {
        const userRes = userNode.evaluate(scope);
        const targetRes = targetNode.evaluate(scope);

        if (
          typeof userRes === "number" &&
          typeof targetRes === "number" &&
          !isNaN(userRes) &&
          !isNaN(targetRes)
        ) {
          if (Math.abs(userRes - targetRes) < 1e-4) {
            matchCount++;
          }
        }
      } catch {
        // Evaluate error at sample point (e.g. division by zero)
      }
    }

    const isCorrect = matchCount >= 8; // At least 80% sample points match

    return {
      is_correct: isCorrect,
      points_awarded: isCorrect ? maxPoints : 0,
      max_points: maxPoints,
    };
  } catch (err) {
    return {
      is_correct: false,
      points_awarded: 0,
      max_points: maxPoints,
      feedback_text: "Biểu thức Toán không hợp lệ.",
    };
  }
}

/**
 * Grade Short Text matching
 */
export function gradeShortText(
  userResponse: string,
  acceptedList: string[],
  ignoreAccents: boolean = true,
  caseSensitive: boolean = false,
  maxPoints: number = 1.0
): GradeResult {
  if (!userResponse) {
    return { is_correct: false, points_awarded: 0, max_points: maxPoints };
  }

  let formattedUser = userResponse.trim();
  if (!caseSensitive) formattedUser = formattedUser.toLowerCase();
  if (ignoreAccents) formattedUser = removeVietnameseAccents(formattedUser);

  const isCorrect = acceptedList.some((accepted) => {
    let formattedAccepted = accepted.trim();
    if (!caseSensitive) formattedAccepted = formattedAccepted.toLowerCase();
    if (ignoreAccents) formattedAccepted = removeVietnameseAccents(formattedAccepted);
    return formattedUser === formattedAccepted;
  });

  return {
    is_correct: isCorrect,
    points_awarded: isCorrect ? maxPoints : 0,
    max_points: maxPoints,
  };
}
