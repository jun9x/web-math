"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MathCheatsheet } from "@/components/student/MathCheatsheet";
import { Scratchpad } from "@/components/student/Scratchpad";
import { BookMarked, PenTool, FileText, ArrowLeft, Video, ExternalLink } from "lucide-react";

export default function StudentLibraryPage() {
  const [activeTab, setActiveTab] = useState<"cheatsheet" | "scratchpad" | "materials">("cheatsheet");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Back Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Góc Học Tập
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Thư Viện & Công Cụ Học Tập Toán 8</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tổng hợp công thức, tài liệu bài giảng và bảng nháp tính toán thông minh
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <button
            onClick={() => setActiveTab("cheatsheet")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "cheatsheet"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookMarked className="w-4 h-4" /> Sổ tay công thức
          </button>

          <button
            onClick={() => setActiveTab("scratchpad")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "scratchpad"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <PenTool className="w-4 h-4" /> Bảng nháp
          </button>

          <button
            onClick={() => setActiveTab("materials")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "materials"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" /> Tài liệu & Video
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "cheatsheet" && <MathCheatsheet />}

        {activeTab === "scratchpad" && (
          <div className="space-y-4">
            <div className="text-sm font-semibold text-slate-300">
              Vẽ hình học, thử nghiệm phép tính hằng đẳng thức và nháp bài làm ngay trên màn hình:
            </div>
            <Scratchpad />
          </div>
        )}

        {activeTab === "materials" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Chuyên Đề 7 Hằng Đẳng Thức Đáng Nhớ (PDF)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tài liệu tóm tắt lý thuyết, sơ đồ tư duy và 50 bài tập tự luyện có đáp án chi tiết.
              </p>
              <div className="pt-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-all"
                >
                  Xem tài liệu PDF <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Video Bài Giảng: Định Lý Thalès & Tam Giác Đồng Dạng</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Video trực quan minh họa cách vận dụng tỉ lệ Thalès giải quyết các bài toán chứng minh hình học 8.
              </p>
              <div className="pt-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold border border-slate-700 transition-all"
                >
                  Xem video bài giảng <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
