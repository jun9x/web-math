"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle, Clock, Edit3, MessageSquare, ArrowLeft, Award, Users } from "lucide-react";

interface StudentAttempt {
  id: string;
  studentName: string;
  submittedAt: string;
  score: number;
  maxScore: number;
  status: "graded" | "needs_review";
  teacherComment?: string;
}

const INITIAL_ATTEMPTS: StudentAttempt[] = [
  {
    id: "att-1",
    studentName: "Trần Bình An",
    submittedAt: "2026-10-06 14:30",
    score: 8.5,
    maxScore: 10.0,
    status: "graded",
    teacherComment: "Làm bài tốt, lưu ý dấu của hằng đẳng thức số 2.",
  },
  {
    id: "att-2",
    studentName: "Lê Minh Khoa",
    submittedAt: "2026-10-06 15:10",
    score: 9.5,
    maxScore: 10.0,
    status: "graded",
    teacherComment: "Xuất sắc! Lời giải rõ ràng.",
  },
  {
    id: "att-3",
    studentName: "Vũ Phương Nhi",
    submittedAt: "2026-10-07 09:20",
    score: 6.0,
    maxScore: 10.0,
    status: "needs_review",
    teacherComment: "",
  },
];

export default function TeacherAssignmentDetailsPage() {
  const [attempts, setAttempts] = useState<StudentAttempt[]>(INITIAL_ATTEMPTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newScore, setNewScore] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");

  const handleStartEdit = (att: StudentAttempt) => {
    setEditingId(att.id);
    setNewScore(att.score);
    setNewComment(att.teacherComment || "");
  };

  const handleSaveEdit = (id: string) => {
    setAttempts(
      attempts.map((a) =>
        a.id === id
          ? {
              ...a,
              score: newScore,
              teacherComment: newComment,
              status: "graded",
            }
          : a
      )
    );
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Navigation Header */}
      <div className="border-b border-slate-800 pb-4">
        <Link
          href="/teacher/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Bảng điều khiển
        </Link>
        <h1 className="text-3xl font-extrabold text-white">
          Bài Tập Luyện Tập: Hằng Đẳng Thức & Phân Thức
        </h1>
        <p className="text-sm font-medium text-slate-300 mt-1">
          Lớp: <span className="text-indigo-400 font-bold">Toán 8A1</span> | Chế độ: <span className="text-emerald-400 font-bold">Luyện tập</span>
        </p>
      </div>

      {/* Class Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">8.0 / 10</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Điểm trung bình lớp</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">3 / 5</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Số bài đã nộp</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tỉ lệ đạt yêu cầu</div>
          </div>
        </div>
      </div>

      {/* Student Submissions & Manual Grading Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Kết Quả Bài Làm Học Sinh & Chấm Điểm
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Học sinh</th>
                <th className="px-4 py-3">Thời gian nộp</th>
                <th className="px-4 py-3">Điểm số</th>
                <th className="px-4 py-3">Nhận xét của giáo viên</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {attempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-4 font-bold text-white">{att.studentName}</td>
                  <td className="px-4 py-4 text-xs text-slate-400">{att.submittedAt}</td>
                  <td className="px-4 py-4 font-bold text-emerald-400">
                    {editingId === att.id ? (
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="10"
                        value={newScore}
                        onChange={(e) => setNewScore(Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-xs font-bold"
                      />
                    ) : (
                      `${att.score} / ${att.maxScore}`
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-300">
                    {editingId === att.id ? (
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Nhập nhận xét cho học sinh..."
                        className="w-full px-3 py-1 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                      />
                    ) : (
                      att.teacherComment || <span className="italic text-slate-500">Chưa có nhận xét</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {editingId === att.id ? (
                      <button
                        onClick={() => handleSaveEdit(att.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm"
                      >
                        Lưu điểm
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(att)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Sửa / Ghi đè điểm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
