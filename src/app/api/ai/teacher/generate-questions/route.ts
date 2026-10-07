import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateStructuredJson } from "@/lib/ai/gemini";
import { TEACHER_QUESTION_GEN_PROMPT } from "@/lib/ai/prompts";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const requestSchema = z.object({
  topicId: z.string().optional(),
  grade: z.number().default(8),
  count: z.number().min(1).max(10).default(3),
  cognitiveLevel: z.enum(["recognize", "understand", "apply", "advanced"]).default("understand"),
  type: z.enum(["mcq_single", "mcq_multi", "true_false", "numeric", "expression", "short_text", "essay"]).default("mcq_single"),
  topicName: z.string().default("Hằng đẳng thức đáng nhớ & Phân thức đại số"),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // Verify teacher role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "teacher" && profile?.role !== "admin") {
      return NextResponse.json({ error: "Chỉ giáo viên mới có quyền tạo câu hỏi AI" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = requestSchema.parse(body);

    const prompt = `Soạn ${parsed.count} câu hỏi Toán Lớp ${parsed.grade} chủ đề "${parsed.topicName}".
Mức độ nhận thức: ${parsed.cognitiveLevel}. Loại câu: ${parsed.type}.
Trả về danh sách câu hỏi theo JSON Schema dưới dạng một object có key "questions":
{
  "questions": [
    {
      "body_latex": "Nội dung câu hỏi dạng LaTeX",
      "explanation_latex": "Lời giải chi tiết dạng LaTeX",
      "hints": ["Tầng 1 kiến thức", "Tầng 2 định hướng", "Tầng 3 bước làm"],
      "options": [
        { "label": "A", "body_latex": "Đáp án A", "is_correct": true },
        { "label": "B", "body_latex": "Đáp án B", "is_correct": false, "misconception_note": "Ghi chú lỗi sai nhầm lẫn B" }
      ],
      "accepted_values": ["Đáp án số hoặc biểu thức nếu là câu numeric/expression/short_text"]
    }
  ]
}`;

    const aiResult = await generateStructuredJson<{ questions: any[] }>(
      prompt,
      TEACHER_QUESTION_GEN_PROMPT
    );

    const createdQuestions = [];
    if (Array.isArray(aiResult?.questions)) {
      for (const q of aiResult.questions) {
        // Insert Draft Question into DB
        const { data: questionData, error: qErr } = await supabase
          .from("questions")
          .insert({
            author_id: user.id,
            topic_id: parsed.topicId || null,
            type: parsed.type,
            cognitive_level: parsed.cognitiveLevel,
            difficulty: 3,
            body_latex: q.body_latex || "Đề bài mẫu",
            explanation_latex: q.explanation_latex || "",
            hints: q.hints || [],
            status: "draft",
            source: "ai",
          })
          .select("id")
          .single();

        if (qErr || !questionData) continue;

        // Insert options if mcq
        if (Array.isArray(q.options) && q.options.length > 0) {
          const optionsToInsert = q.options.map((opt: any) => ({
            question_id: questionData.id,
            label: opt.label || "A",
            body_latex: opt.body_latex || "",
            is_correct: Boolean(opt.is_correct),
            misconception_note: opt.misconception_note || null,
          }));
          await supabase.from("question_options").insert(optionsToInsert);
        }

        // Insert answers if numeric/expression/short_text
        if (q.accepted_values) {
          await supabase.from("question_answers").insert({
            question_id: questionData.id,
            accepted: { accepted_values: q.accepted_values },
          });
        }

        createdQuestions.push(questionData.id);
      }
    }

    return NextResponse.json({
      success: true,
      count: createdQuestions.length,
      questionIds: createdQuestions,
    });
  } catch (error: any) {
    console.error("AI Question Generation Error:", error);
    return NextResponse.json(
      { error: "Không thể sinh câu hỏi bằng AI: " + (error.message || "") },
      { status: 500 }
    );
  }
}
