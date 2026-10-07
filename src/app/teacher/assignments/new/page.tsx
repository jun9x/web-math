"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MathRenderer } from "@/components/math/MathRenderer";
import { BookOpen, CheckCircle, Clock, ShieldAlert, Sparkles, ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function NewAssignmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [classId, setClassId] = useState("c0000000-0000-0000-0000-000000000001");
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [title, setTitle] = useState("Bài Tập Luyện Tập Hằng Đẳng Thức & Phân Thức");
  const [description, setDescription] = useState("Luyện tập củng cố các hằng đẳng thức đáng nhớ và quy tắc rút gọn phân thức.");
  const [timeLimit, setTimeLimit] = useState<number | "">(15);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [allowAiHints, setAllowAiHints] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([
    "q0000000-0000-0000-0000-000000000001",
    "q0000000-0000-0000-0000-000000000002",
  ]);

  const handlePublish = () => {
    // Redirect to teacher dashboard after creating
    router.push("/teacher/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <Link
          href="/teacher/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Bảng điều khiển
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Tạo Bài Giao Mới (Assignment Wizard)</h1>
        <p className="text-sm font-medium text-slate-300 mt-1">
          Quy trình 4 bước thiết lập bài tập luyện tập hoặc bài kiểm tra 15 phút
        </p>
      </div>

      {/* Wizard Progress Bar */}
      <div className="grid grid-cols-4 gap-2">
        {["1. Chọn Chế Độ", "2. Cấu Hình Thời Gian", "3. Chọn Câu Hỏi", "4. Xem Trước & Giao"].map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                isActive
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  : isDone
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                  : "bg-slate-900/60 border-slate-800 text-slate-500"
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Step 1: Mode & Class */}
      {step === 1 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-white">Bước 1: Chọn Chế Độ & Lớp Học</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Lớp nhận bài giao
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="c0000000-0000-0000-0000-000000000001">Lớp Toán 8A1 - GDPT 2018</option>
              <option value="c0000000-0000-0000-0000-000000000002">Lớp Toán 8A2 - Ôn Tập Hằng Đẳng Thức</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Chế độ làm bài
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode("practice")}
                className={`p-5 rounded-2xl border text-left space-y-2 transition-all ${
                  mode === "practice"
                    ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-xl shadow-emerald-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-emerald-300">🟢 Bài Luyện Tập</span>
                  {mode === "practice" && <Check className="w-5 h-5 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Làm lại nhiều lần, có gợi ý 3 tầng, hiển thị đáp án và lời giải giải thích tức thì. Gia sư AI mở hỗ trợ học sinh.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("exam");
                  setAllowAiHints(false);
                }}
                className={`p-5 rounded-2xl border text-left space-y-2 transition-all ${
                  mode === "exam"
                    ? "bg-rose-500/10 border-rose-500/50 text-white shadow-xl shadow-rose-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-rose-300">🔴 Bài Kiểm Tra</span>
                  {mode === "exam" && <Check className="w-5 h-5 text-rose-400" />}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Giới hạn thời gian, <strong>khóa Gia sư AI hoàn toàn</strong>, không gợi ý. Đáp án bảo mật nghiêm ngặt.
                </p>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              Tiếp tục đến Bước 2 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Config Details */}
      {step === 2 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-white">Bước 2: Cấu Hình Tên & Thời Gian</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Tiêu đề bài giao
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mô tả hướng dẫn học sinh
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Thời gian làm bài (phút)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  placeholder="Ví dụ: 15 (Để trống nếu không giới hạn)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Số lần làm bài tối đa
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {mode === "practice" && (
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="allowAi"
                  checked={allowAiHints}
                  onChange={(e) => setAllowAiHints(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="allowAi" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Cho phép mở Gia sư AI Socrates & 3 tầng gợi ý trong lúc luyện tập
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
            >
              Quay lại
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              Tiếp tục đến Bước 3 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Questions */}
      {step === 3 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-white">Bước 3: Chọn Câu Hỏi Từ Ngân Hàng</h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">
                  <MathRenderer content="Khai triển hằng đẳng thức $(x + 3)^2$..." />
                </div>
                <div className="text-xs text-indigo-400">Chủ đề: Các Hằng đẳng thức đáng nhớ</div>
              </div>
              <input
                type="checkbox"
                checked={selectedQuestions.includes("q0000000-0000-0000-0000-000000000001")}
                onChange={(e) => {
                  if (e.target.checked) setSelectedQuestions([...selectedQuestions, "q0000000-0000-0000-0000-000000000001"]);
                  else setSelectedQuestions(selectedQuestions.filter((id) => id !== "q0000000-0000-0000-0000-000000000001"));
                }}
                className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">
                  <MathRenderer content="Giải phương trình bậc nhất: $2x - 8 = 0$." />
                </div>
                <div className="text-xs text-indigo-400">Chủ đề: Phương trình bậc nhất một ẩn</div>
              </div>
              <input
                type="checkbox"
                checked={selectedQuestions.includes("q0000000-0000-0000-0000-000000000002")}
                onChange={(e) => {
                  if (e.target.checked) setSelectedQuestions([...selectedQuestions, "q0000000-0000-0000-0000-000000000002"]);
                  else setSelectedQuestions(selectedQuestions.filter((id) => id !== "q0000000-0000-0000-0000-000000000002"));
                }}
                className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
            >
              Quay lại
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              Xem trước bài làm <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Preview & Publish */}
      {step === 4 && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" /> Bước 4: Xem Trước & Phát Hành
          </h3>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                mode === "exam" ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
              }`}>
                {mode === "exam" ? "Bài kiểm tra 15 phút" : "Bài luyện tập"}
              </span>
              <span className="text-xs text-slate-400">Thời gian: {timeLimit ? `${timeLimit} phút` : "Không giới hạn"}</span>
            </div>

            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-xs text-slate-300">{description}</p>
            <div className="text-xs font-semibold text-indigo-400">
              Tổng số câu hỏi chọn: {selectedQuestions.length} câu
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
            >
              Quay lại chỉnh sửa
            </button>
            <button
              onClick={handlePublish}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> Phát hành bài giao cho học sinh ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
