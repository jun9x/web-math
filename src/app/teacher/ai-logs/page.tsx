"use client";

import React from "react";
import Link from "next/link";
import { BrainCircuit, ShieldAlert, MessageSquare, ArrowLeft, Clock, User } from "lucide-react";

interface AiLogItem {
  id: string;
  studentName: string;
  contextType: string;
  messageCount: number;
  flagged: boolean;
  lastActive: string;
  samplePrompt: string;
}

const DEMO_LOGS: AiLogItem[] = [
  {
    id: "log-1",
    studentName: "Trần Bình An",
    contextType: "Gia sư Socratic (Hằng đẳng thức)",
    messageCount: 6,
    flagged: false,
    lastActive: "2026-10-07 14:20",
    samplePrompt: "Thầy ơi cho em hỏi hằng đẳng thức số 2 khác số 1 ở chỗ nào ạ?",
  },
  {
    id: "log-2",
    studentName: "Lê Minh Khoa",
    contextType: "Gia sư Socratic (Phần thức)",
    messageCount: 4,
    flagged: false,
    lastActive: "2026-10-07 15:05",
    samplePrompt: "Làm thế nào để đổi dấu phân thức ạ?",
  },
];

export default function TeacherAiLogsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <Link
          href="/teacher/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Bảng điều khiển
        </Link>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <BrainCircuit className="w-7 h-7 text-indigo-400" /> Nhật Ký Gia Sư AI & Giám Sát An Toàn
        </h1>
        <p className="text-sm font-medium text-slate-300 mt-1">
          Theo dõi nội dung trao đổi của học sinh với Gia sư AI Socrates và xem cảnh báo an toàn
        </p>
      </div>

      {/* Log List */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" /> Lịch Sử Hội Thoại Gần Đây
        </h2>

        <div className="space-y-4">
          {DEMO_LOGS.map((log) => (
            <div
              key={log.id}
              className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white text-sm">{log.studentName}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {log.contextType}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{log.lastActive}</span>
              </div>

              <div className="text-xs text-slate-300 italic">
                "{log.samplePrompt}"
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                <span>Số tin nhắn: <strong>{log.messageCount} lượt</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">✓ Không phát hiện vi phạm an toàn</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
