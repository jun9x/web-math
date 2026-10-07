import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGeminiClient } from "@/lib/ai/gemini";
import { SOCRATIC_TUTOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await req.json();
    const { assignmentId, questionId, userMessage, grade = 8, currentResponse } = body;

    // Check if user is in an ongoing EXAM mode attempt
    if (assignmentId) {
      const { data: assignment } = await supabase
        .from("assignments")
        .select("mode")
        .eq("id", assignmentId)
        .single();

      if (assignment?.mode === "exam") {
        const { data: attempt } = await supabase
          .from("attempts")
          .select("status")
          .eq("assignment_id", assignmentId)
          .eq("student_id", user.id)
          .eq("status", "in_progress")
          .single();

        if (attempt) {
          return NextResponse.json(
            { error: "Gia sư AI bị khóa hoàn toàn trong khi làm bài kiểm tra!" },
            { status: 403 }
          );
        }
      }
    }

    // Check Daily AI Rate Limit
    const today = new Date().toISOString().split("T")[0];
    const { data: usage } = await supabase
      .from("ai_usage_daily")
      .select("count")
      .eq("user_id", user.id)
      .eq("day", today)
      .single();

    const currentCount = usage?.count || 0;
    if (currentCount >= env.AI_DAILY_LIMIT_STUDENT) {
      return NextResponse.json(
        { error: "Bạn đã vượt quá giới hạn lượt hỏi AI hôm nay. Hãy quay lại vào ngày mai!" },
        { status: 429 }
      );
    }

    // Update Daily Limit
    await supabase.from("ai_usage_daily").upsert({
      user_id: user.id,
      day: today,
      count: currentCount + 1,
    });

    // Fetch Question Details for Context
    let questionContext = "";
    if (questionId) {
      const { data: q } = await supabase
        .from("questions")
        .select("body_latex, cognitive_level, hints")
        .eq("id", questionId)
        .single();

      if (q) {
        questionContext = `\n[Đề bài câu hỏi: ${q.body_latex}]\n[Mức độ nhận thức: ${q.cognitive_level}]\n[Các tầng gợi ý sẵn có: ${JSON.stringify(q.hints)}]`;
      }
    }

    const fullPrompt = `Học sinh Lớp ${grade} đang nhắn:${questionContext}\n[Bài làm hiện tại của học sinh: ${currentResponse || "Chưa có"}]\nTin nhắn học sinh: "${userMessage}"`;

    const ai = getGeminiClient();
    const responseStream = await ai.models.generateContentStream({
      model: env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: [fullPrompt],
      config: {
        systemInstruction: SOCRATIC_TUTOR_SYSTEM_PROMPT,
      },
    });

    // Create ReadableStream for HTTP Response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          const text = chunk.text || "";
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("AI Tutor API Error:", error);
    return NextResponse.json(
      { error: "Không thể kết nối tới Gia sư AI. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
