// Central synchronized state for MathLab local demo

export interface ClassItem {
  id: string;
  name: string;
  grade: number;
  joinCode: string;
  studentCount: number;
  isOpenEnrollment: boolean;
  teacherName: string;
  createdAt: string;
}

export interface QuestionItem {
  id: string;
  topicName: string;
  type: "mcq_single" | "numeric" | "expression" | "short_text";
  cognitiveLevel: "recognize" | "understand" | "apply" | "advanced";
  difficulty: number;
  bodyLatex: string;
  explanationLatex?: string;
  hints: string[];
  options?: { id: string; label: string; bodyLatex: string; isCorrect: boolean; misconceptionNote?: string }[];
  acceptedValues?: string[];
  status: "draft" | "approved";
  source: "manual" | "ai";
}

export interface AssignmentItem {
  id: string;
  classId: string;
  className: string;
  title: string;
  description: string;
  mode: "practice" | "exam";
  timeLimitMinutes?: number;
  maxAttempts: number;
  showSolutionPolicy: "immediate" | "after_due" | "manual";
  allowAiHints: boolean;
  isPublished: boolean;
  questionIds: string[];
  createdAt: string;
  dueAt?: string;
}

export interface StudentAttempt {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  status: "in_progress" | "submitted" | "graded";
  score?: number;
  maxScore: number;
  answers: Record<string, any>;
  teacherComment?: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  kind: "pdf" | "video" | "link" | "image";
  topicName: string;
  grade: number;
  uploadedAt: string;
  url?: string;
}

// Global initial state
export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    name: "Lớp Toán 8A1 - GDPT 2018",
    grade: 8,
    joinCode: "MATH08",
    studentCount: 5,
    isOpenEnrollment: true,
    teacherName: "Thầy Nguyễn Văn Toán",
    createdAt: "2026-10-06",
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    name: "Lớp Toán 8A2 - Ôn Tập Hằng Đẳng Thức",
    grade: 8,
    joinCode: "ALG08B",
    studentCount: 3,
    isOpenEnrollment: true,
    teacherName: "Thầy Nguyễn Văn Toán",
    createdAt: "2026-10-07",
  },
];

export const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: "q0000000-0000-0000-0000-000000000001",
    topicName: "Các Hằng đẳng thức đáng nhớ",
    type: "mcq_single",
    cognitiveLevel: "recognize",
    difficulty: 1,
    bodyLatex: "Khai triển hằng đẳng thức $(x + 3)^2$ ta được kết quả nào sau đây?",
    explanationLatex: "Áp dụng $(a+b)^2 = a^2 + 2ab + b^2$ với $a=x, b=3$ ta có $(x+3)^2 = x^2 + 6x + 9$.",
    hints: [
      "Áp dụng công thức $(a+b)^2 = a^2 + 2ab + b^2$",
      "Thay $a = x$ và $b = 3$",
      "Tính $2 \\cdot x \\cdot 3 = 6x$ và $3^2 = 9$",
    ],
    options: [
      { id: "o1", label: "A", bodyLatex: "$x^2 + 6x + 9$", isCorrect: true },
      { id: "o2", label: "B", bodyLatex: "$x^2 + 9$", isCorrect: false, misconceptionNote: "Lỗi quên số hạng tích 2ab" },
      { id: "o3", label: "C", bodyLatex: "$x^2 + 3x + 9$", isCorrect: false, misconceptionNote: "Lỗi nhầm 2ab thành ab" },
      { id: "o4", label: "D", bodyLatex: "$x^2 - 6x + 9$", isCorrect: false, misconceptionNote: "Lỗi nhầm dấu cộng thành trừ" },
    ],
    status: "approved",
    source: "manual",
  },
  {
    id: "q0000000-0000-0000-0000-000000000002",
    topicName: "Phương trình bậc nhất một ẩn",
    type: "numeric",
    cognitiveLevel: "understand",
    difficulty: 2,
    bodyLatex: "Giải phương trình bậc nhất một ẩn: $2x - 8 = 0$. Giá trị của $x$ là bao nhiêu?",
    explanationLatex: "Ta có $2x = 8 \\Rightarrow x = 4$.",
    hints: [
      "Chuyển số hạng tự do $-8$ sang vế phải",
      "Ta được $2x = 8$",
      "Chia hai vế cho 2 để tìm $x$",
    ],
    acceptedValues: ["4", "4.0"],
    status: "approved",
    source: "manual",
  },
  {
    id: "q0000000-0000-0000-0000-000000000003",
    topicName: "Các Hằng đẳng thức đáng nhớ",
    type: "expression",
    cognitiveLevel: "apply",
    difficulty: 3,
    bodyLatex: "Rút gọn biểu thức hằng đẳng thức: $A = (x + 2)^2 - (x - 2)^2$.",
    explanationLatex: "Khai triển: $A = (x^2 + 4x + 4) - (x^2 - 4x + 4) = 8x$.",
    hints: [
      "Khai triển hai hằng đẳng thức $(a+b)^2$ và $(a-b)^2$",
      "Mở dấu ngoặc lưu ý đổi dấu phép trừ",
      "Rút gọn các hạng tử đồng dạng",
    ],
    acceptedValues: ["8*x", "8x"],
    status: "approved",
    source: "manual",
  },
];

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    classId: "c0000000-0000-0000-0000-000000000001",
    className: "Lớp Toán 8A1 - GDPT 2018",
    title: "Bài Luyện Tập: Hằng Đẳng Thức & Phân Thức",
    description: "Luyện tập củng cố kiến thức hằng đẳng thức đáng nhớ và phương trình bậc nhất.",
    mode: "practice",
    timeLimitMinutes: undefined,
    maxAttempts: 5,
    showSolutionPolicy: "immediate",
    allowAiHints: true,
    isPublished: true,
    questionIds: [
      "q0000000-0000-0000-0000-000000000001",
      "q0000000-0000-0000-0000-000000000002",
      "q0000000-0000-0000-0000-000000000003",
    ],
    createdAt: "2026-10-06",
    dueAt: "2026-10-20",
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    classId: "c0000000-0000-0000-0000-000000000001",
    className: "Lớp Toán 8A1 - GDPT 2018",
    title: "Bài Kiểm Tra 15 Phút - Toán Lớp 8 Giữa Kỳ",
    description: "Kiểm tra đánh giá năng lực Toán 8. Gia sư AI bị khóa hoàn toàn trong suốt quá trình làm bài.",
    mode: "exam",
    timeLimitMinutes: 15,
    maxAttempts: 1,
    showSolutionPolicy: "after_due",
    allowAiHints: false,
    isPublished: true,
    questionIds: [
      "q0000000-0000-0000-0000-000000000001",
      "q0000000-0000-0000-0000-000000000002",
    ],
    createdAt: "2026-10-07",
    dueAt: "2026-10-14",
  },
];

export const INITIAL_ATTEMPTS: StudentAttempt[] = [
  {
    id: "att-1",
    assignmentId: "a0000000-0000-0000-0000-000000000001",
    studentId: "e0000000-0000-0000-0000-000000000002",
    studentName: "Trần Bình An",
    startedAt: "2026-10-06 14:00",
    submittedAt: "2026-10-06 14:30",
    status: "graded",
    score: 8.5,
    maxScore: 10.0,
    answers: {},
    teacherComment: "Làm bài tốt, lưu ý dấu của hằng đẳng thức số 2.",
  },
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: "m-1",
    title: "Chuyên Đề 7 Hằng Đẳng Thức Đáng Nhớ & Bài Tập 8",
    kind: "pdf",
    topicName: "Các Hằng đẳng thức đáng nhớ",
    grade: 8,
    uploadedAt: "2026-10-06",
  },
  {
    id: "m-2",
    title: "Video Bài Giảng: Phương Trình Bậc Nhất Một Ẩn",
    kind: "video",
    topicName: "Phương trình bậc nhất một ẩn",
    grade: 8,
    uploadedAt: "2026-10-07",
  },
];
