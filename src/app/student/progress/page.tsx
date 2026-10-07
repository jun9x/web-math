"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Award, Target, BrainCircuit, CheckCircle2 } from "lucide-react";

interface TopicMastery {
  name: string;
  accuracy: number; // Percentage 0-100
  status: "strong" | "medium" | "weak";
  suggestedAction: string;
}

const TOPIC_MASTERY_DATA: TopicMastery[] = [
  {
    name: "Các Hằng đẳng thức đáng nhớ",
    accuracy: 92,
    status: "strong",
    suggestedAction: "Năng lực xuất sắc! Sẵn sàng làm bài tập vận dụng cao.",
  },
  {
    name: "Đa thức nhiều biến",
    accuracy: 85,
    status: "strong",
    suggestedAction: "Nắm chắc lý thuyết và các phép toán cơ bản.",
  },
  {
    name: "Hàm số bậc nhất y = ax + b",
    accuracy: 70,
    status: "medium",
    suggestedAction: "Nên luyện tập thêm về dạng bài xác định hệ số góc và đồ thị.",
  },
  {
    name: "Phân thức đại số",
    accuracy: 55,
    status: "weak",
    suggestedAction: "Cần xem lại quy tắc đổi dấu và rút gọn phân thức.",
  },
  {
    name: "Hình học Tứ giác & Định lý Thalès",
    accuracy: 62,
    status: "medium",
    suggestedAction: "Ôn lại chứng minh đường trung bình và tỉ lệ tam giác.",
  },
];

export default function StudentProgressPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Góc Học Tập
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Báo Cáo Tiến Độ Cá Nhân</h1>
          <p className="text-sm text-slate-400 mt-1">
            Theo dõi sự phát triển của bản thân theo chuẩn kiến thức Toán Lớp 8 (GDPT 2018)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <div className="text-xl font-bold text-indigo-300">82%</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Tỉ lệ đúng trung bình</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="text-xl font-bold text-emerald-300">14</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Bài tập hoàn thành</div>
          </div>
        </div>
      </div>

      {/* AI Tutor Personal Insights */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
          <BrainCircuit className="w-6 h-6 text-cyan-300" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Đánh Giá Tự Động Từ Gia Sư AI Socrates
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            "Chào bạn! Bạn đang thực hiện rất tốt các dạng bài về <strong className="text-indigo-300">Hằng đẳng thức đáng nhớ</strong>. Tuy nhiên, tốc độ giải các câu về <strong className="text-amber-300">Phân thức đại số</strong> cần cải thiện ở bước quy đồng mẫu thức. Hãy dành 10 phút làm thêm bài củng cố hôm nay nhé!"
          </p>
        </div>
      </div>

      {/* Topic Mastery Grid */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" /> Mức Độ Thành Thục Theo Chủ Đề Toán 8
        </h2>

        <div className="space-y-6">
          {TOPIC_MASTERY_DATA.map((topic, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                <span className="font-semibold text-white">{topic.name}</span>
                <span className="text-xs font-bold text-slate-300">
                  {topic.accuracy}% đúng
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    topic.status === "strong"
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                      : topic.status === "medium"
                      ? "bg-gradient-to-r from-indigo-500 to-amber-400"
                      : "bg-gradient-to-r from-rose-500 to-amber-500"
                  }`}
                  style={{ width: `${topic.accuracy}%` }}
                />
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{topic.suggestedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
