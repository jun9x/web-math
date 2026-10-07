"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MathRenderer } from "@/components/math/MathRenderer";
import { RotateCw, CheckCircle, Flame, ArrowLeft, Sparkles, Trophy } from "lucide-react";

interface FlashcardItem {
  id: string;
  topic: string;
  front: string;
  back: string;
  hint?: string;
}

const DEMO_FLASHCARDS: FlashcardItem[] = [
  {
    id: "card-1",
    topic: "Hằng đẳng thức Lớp 8",
    front: "Khai triển hằng đẳng thức $$(a + b)^2$$",
    back: "$$(a + b)^2 = a^2 + 2ab + b^2$$",
    hint: "Nhớ số hạng $2ab$ ở giữa!",
  },
  {
    id: "card-2",
    topic: "Hằng đẳng thức Lớp 8",
    front: "Khai triển hằng đẳng thức $$a^2 - b^2$$",
    back: "$$a^2 - b^2 = (a - b)(a + b)$$",
    hint: "Tích của hiệu và tổng",
  },
  {
    id: "card-3",
    topic: "Phương trình Lớp 8",
    front: "Nghiệm của phương trình $$3x - 12 = 0$$ là bao nhiêu?",
    back: "$$x = 4$$",
    hint: "Chuyển $-12$ sang vế phải thành $12$, sau đó chia 3",
  },
  {
    id: "card-4",
    topic: "Hàm số Lớp 8",
    front: "Hàm số $$y = 2x + 1$$ là hàm đồng biến hay nghịch biến?",
    back: "Hàm số **đồng biến** trên $\\mathbb{R}$ vì hệ số góc $a = 2 > 0$.",
  },
  {
    id: "card-5",
    topic: "Hình học Lớp 8",
    front: "Phát biểu Định lý Thalès thuận trong tam giác?",
    back: "Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó các đoạn thẳng **tương ứng tỉ lệ**.",
  },
];

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(3);
  const [completedCount, setCompletedCount] = useState(0);

  const card = DEMO_FLASHCARDS[currentIndex];
  const isFinished = currentIndex >= DEMO_FLASHCARDS.length;

  const handleNext = (difficulty: "easy" | "medium" | "hard") => {
    setIsFlipped(false);
    setCompletedCount((prev) => prev + 1);
    if (difficulty === "easy") setStreak((prev) => prev + 1);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 200);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCompletedCount(0);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Góc Học Tập
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-400" /> Chuỗi ôn tập: {streak} ngày
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Card Meta & Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-indigo-400 uppercase tracking-wider">
              {card.topic}
            </span>
            <span>
              Thẻ {currentIndex + 1} / {DEMO_FLASHCARDS.length}
            </span>
          </div>

          {/* Flashcard Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[320px] p-8 rounded-3xl glass-panel border border-slate-700/80 shadow-2xl flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10 group relative select-none"
          >
            <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              {isFlipped ? "💡 Lời Giải / Đáp Án" : "❓ Thẻ Câu Hỏi (Bấm để lật thẻ)"}
            </div>

            <div className="my-auto py-6">
              {!isFlipped ? (
                <div className="text-xl font-bold text-white leading-relaxed">
                  <MathRenderer content={card.front} />
                </div>
              ) : (
                <div className="text-xl font-bold text-emerald-300 leading-relaxed">
                  <MathRenderer content={card.back} />
                </div>
              )}

              {!isFlipped && card.hint && (
                <div className="mt-4 text-xs text-indigo-300/80 bg-indigo-500/10 px-3 py-1.5 rounded-full inline-block">
                  Gợi ý: {card.hint}
                </div>
              )}
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1.5 group-hover:text-indigo-400 transition-colors">
              <RotateCw className="w-3.5 h-3.5" /> Bấm để lật mặt thẻ
            </div>
          </div>

          {/* Rating Action Buttons (Shown after flipping) */}
          {isFlipped ? (
            <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <button
                onClick={() => handleNext("hard")}
                className="py-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-xs transition-all flex flex-col items-center gap-1"
              >
                <span>🔴 Khó nhớ</span>
                <span className="text-[10px] text-slate-400 font-normal">Ôn lại sau 1 ngày</span>
              </button>

              <button
                onClick={() => handleNext("medium")}
                className="py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-all flex flex-col items-center gap-1"
              >
                <span>🟡 Vừa phải</span>
                <span className="text-[10px] text-slate-400 font-normal">Ôn lại sau 3 ngày</span>
              </button>

              <button
                onClick={() => handleNext("easy")}
                className="py-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all flex flex-col items-center gap-1"
              >
                <span>🟢 Nhớ tốt</span>
                <span className="text-[10px] text-slate-400 font-normal">Ôn lại sau 7 ngày</span>
              </button>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 italic">
              Hãy nhấp vào thẻ ở trên để xem lời giải trước khi đánh giá mức độ ghi nhớ!
            </div>
          )}
        </div>
      ) : (
        /* Completion Screen */
        <div className="p-10 rounded-3xl glass-panel border border-slate-800 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Xuất Sắc! Bạn Đã Hoàn Thành Phiên Ôn Tập</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Bạn vừa hoàn thành ôn luyện <strong className="text-emerald-400">{completedCount} thẻ kiến thức Toán 8</strong> theo phương pháp lặp lại ngắt quãng. Trí nhớ của bạn đang được củng cố rất tốt!
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30"
            >
              Ôn lại lượt nữa
            </button>
            <Link
              href="/student/dashboard"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all border border-slate-700"
            >
              Về Góc Học Tập
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
