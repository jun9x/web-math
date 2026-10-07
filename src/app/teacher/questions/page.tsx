"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MathRenderer } from "@/components/math/MathRenderer";
import { FileQuestion, Plus, Sparkles, Filter, CheckCircle2, AlertCircle, Edit3, Trash2, Upload, Search } from "lucide-react";

import { INITIAL_QUESTIONS, type QuestionItem } from "@/lib/store/demoData";

export default function TeacherQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Editor Modal State
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [editExplanation, setEditExplanation] = useState("");
  const [editCognitive, setEditCognitive] = useState<"recognize" | "understand" | "apply" | "advanced">("understand");
  const [editType, setEditType] = useState("mcq_single");

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBody.trim()) return;

    const newQuestion: QuestionItem = {
      id: `q-${Date.now()}`,
      topicName: "Toán Lớp 8",
      type: editType as any,
      cognitiveLevel: editCognitive,
      difficulty: 2,
      bodyLatex: editBody.trim(),
      explanationLatex: editExplanation.trim() || undefined,
      hints: [],
      status: "approved",
      source: "manual",
    };

    setQuestions([newQuestion, ...questions]);
    setEditBody("");
    setEditExplanation("");
    setShowEditorModal(false);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesLevel = filterLevel === "all" || q.cognitiveLevel === filterLevel;
    const matchesType = filterType === "all" || q.type === filterType;
    const matchesSearch =
      searchKeyword === "" ||
      q.bodyLatex.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      q.topicName.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesLevel && matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/teacher/dashboard"
            className="text-xs font-semibold text-slate-400 hover:text-white mb-2 inline-block transition-colors"
          >
            ← Quay lại Bảng điều khiển
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Ngân Hàng Câu Hỏi Toán 8</h1>
          <p className="text-sm font-medium text-slate-300 mt-1">
            Soạn thảo, quản lý câu hỏi LaTeX và nhập câu hỏi bằng AI
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/teacher/questions/ai"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Soạn bằng AI
          </Link>
          <button
            onClick={() => setShowEditorModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Thêm Câu Hỏi Mới
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-indigo-400" /> Bộ lọc:
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="recognize">Nhận biết</option>
            <option value="understand">Thông hiểu</option>
            <option value="apply">Vận dụng</option>
            <option value="advanced">Vận dụng cao</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="all">Tất cả dạng câu</option>
            <option value="mcq_single">Trắc nghiệm 1 đáp án</option>
            <option value="numeric">Chấm đáp án số</option>
            <option value="expression">Chấm biểu thức</option>
            <option value="short_text">Điền từ ngắn</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm font-medium bg-slate-900/60 rounded-2xl border border-slate-800">
            Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4 shadow-xl relative group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">câu {idx + 1}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                    {q.topicName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                    {q.cognitiveLevel === "recognize" ? "Nhận biết" : q.cognitiveLevel === "understand" ? "Thông hiểu" : q.cognitiveLevel === "apply" ? "Vận dụng" : "Vận dụng cao"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {q.source === "ai" && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 flex items-center gap-1 border border-cyan-500/30">
                      <Sparkles className="w-3 h-3" /> Sinh bởi AI
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-all"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Body Rendered with KaTeX */}
              <div className="text-base font-semibold text-white py-1">
                <MathRenderer content={q.bodyLatex} />
              </div>

              {q.explanationLatex && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-emerald-400">Lời giải chi tiết:</span>
                  <div><MathRenderer content={q.explanationLatex} /></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Editor Modal with Live KaTeX Preview */}
      {showEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">Trình Soạn Thảo Câu Hỏi & Xem Trước KaTeX</h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mức độ nhận thức
                  </label>
                  <select
                    value={editCognitive}
                    onChange={(e) => setEditCognitive(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="recognize">Nhận biết</option>
                    <option value="understand">Thông hiểu</option>
                    <option value="apply">Vận dụng</option>
                    <option value="advanced">Vận dụng cao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Loại câu hỏi
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="mcq_single">Trắc nghiệm chọn 1 đáp án</option>
                    <option value="numeric">Chấm số học (Numeric)</option>
                    <option value="expression">Chấm biểu thức đại số</option>
                    <option value="short_text">Điền từ ngắn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Đề bài câu hỏi (Dùng $...$ cho LaTeX)
                </label>
                <textarea
                  rows={3}
                  required
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  placeholder="Khai triển hằng đẳng thức $(a + b)^2$..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>

              {/* Live KaTeX Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-1">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  👁️ Xem trước hiển thị công thức (Live KaTeX Preview):
                </span>
                <div className="text-base text-white font-semibold pt-1">
                  <MathRenderer content={editBody || "Chưa nhập nội dung..."} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Lời giải chi tiết
                </label>
                <textarea
                  rows={2}
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                  placeholder="Áp dụng công thức $(a+b)^2 = a^2 + 2ab + b^2$..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditorModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Lưu vào ngân hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
