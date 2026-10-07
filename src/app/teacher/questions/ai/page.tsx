"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MathRenderer } from "@/components/math/MathRenderer";
import { Sparkles, Check, Edit3, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

interface DraftQuestion {
  id: string;
  bodyLatex: string;
  explanationLatex: string;
  type: string;
  cognitiveLevel: string;
  hints: string[];
  status: "draft" | "approved";
}

export default function TeacherAiQuestionsPage() {
  const [topicName, setTopicName] = useState("Các Hằng đẳng thức đáng nhớ");
  const [grade, setGrade] = useState(8);
  const [count, setCount] = useState(3);
  const [cognitiveLevel, setCognitiveLevel] = useState("understand");
  const [type, setType] = useState("mcq_single");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftQuestions, setDraftQuestions] = useState<DraftQuestion[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/teacher/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicName,
          grade,
          count,
          cognitiveLevel,
          type,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể khởi tạo câu hỏi AI");
      }

      // Mock output structure for demonstration
      const sampleDrafts: DraftQuestion[] = [
        {
          id: `ai-q-${Date.now()}-1`,
          bodyLatex: `Khai triển hằng đẳng thức $(2x + 1)^2$ ta được đa thức nào sau đây?`,
          explanationLatex: `Áp dụng $(a+b)^2 = a^2 + 2ab + b^2$ với $a=2x, b=1$, ta có $(2x+1)^2 = 4x^2 + 4x + 1$.`,
          type,
          cognitiveLevel,
          hints: [
            "Tầng 1: Áp dụng công thức $(a+b)^2 = a^2 + 2ab + b^2$",
            "Tầng 2: Thay $a = 2x$ và $b = 1$",
            "Tầng 3: Tính $(2x)^2 = 4x^2$ và $2(2x)(1) = 4x$",
          ],
          status: "draft",
        },
        {
          id: `ai-q-${Date.now()}-2`,
          bodyLatex: `Rút gọn biểu thức phân thức: $B = (x - 3)^2 + 6x$.`,
          explanationLatex: `Khai triển: $B = (x^2 - 6x + 9) + 6x = x^2 + 9$.`,
          type,
          cognitiveLevel,
          hints: [
            "Tầng 1: Khai triển $(x-3)^2 = x^2 - 6x + 9$",
            "Tầng 2: Cộng với $6x$",
            "Tầng 3: Rút gọn $-6x + 6x = 0$",
          ],
          status: "draft",
        },
      ];

      setDraftQuestions(sampleDrafts);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo câu hỏi AI");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id: string) => {
    setDraftQuestions(
      draftQuestions.map((q) => (q.id === id ? { ...q, status: "approved" } : q))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Navigation Header */}
      <div className="border-b border-slate-800 pb-4">
        <Link
          href="/teacher/questions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Ngân Hàng Câu Hỏi
        </Link>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-cyan-400" /> Trợ Lý AI Sinh Câu Hỏi Toán 8
        </h1>
        <p className="text-sm font-medium text-slate-300 mt-1">
          Sinh tự động danh sách câu hỏi bám sát chuẩn GDPT 2018 (Hằng đẳng thức, Đa thức, Phân thức)
        </p>
      </div>

      {/* Generator Configuration Form */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
          Cấu hình tạo câu hỏi AI
        </h3>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Chủ đề Toán 8
              </label>
              <input
                type="text"
                required
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mức độ nhận thức
              </label>
              <select
                value={cognitiveLevel}
                onChange={(e) => setCognitiveLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="recognize">Nhận biết</option>
                <option value="understand">Thông hiểu</option>
                <option value="apply">Vận dụng</option>
                <option value="advanced">Vận dụng cao</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Loại câu hỏi
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="mcq_single">Trắc nghiệm chọn 1 đáp án</option>
                <option value="numeric">Chấm đáp án số</option>
                <option value="expression">Chấm biểu thức đại số</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Số lượng câu khởi tạo
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Đang dùng AI soạn thảo câu hỏi...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Sinh danh sách câu hỏi AI ngay</>
            )}
          </button>
        </form>
      </div>

      {/* Generated Draft List */}
      {draftQuestions.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Kết Quả Bản Nháp (Cần Giáo Viên Duyệt)
          </h3>

          <div className="space-y-4">
            {draftQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl relative"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-cyan-400">Câu hỏi AI #{idx + 1}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      q.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {q.status === "approved" ? "✓ Đã duyệt" : "⏳ Bản nháp (Draft)"}
                  </span>
                </div>

                <div className="text-base font-bold text-white">
                  <MathRenderer content={q.bodyLatex} />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-emerald-400">Lời giải chi tiết:</span>
                  <div><MathRenderer content={q.explanationLatex} /></div>
                </div>

                {/* Hints Accordion */}
                <div className="text-xs text-indigo-300 bg-indigo-500/10 p-3 rounded-xl space-y-1 border border-indigo-500/20">
                  <span className="font-bold text-indigo-200">Các tầng gợi ý (Scaffolding hints):</span>
                  {q.hints.map((h, hIdx) => (
                    <div key={hIdx}>- {h}</div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                  {q.status === "draft" && (
                    <button
                      onClick={() => handleApprove(q.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Duyệt và lưu vào kho
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
