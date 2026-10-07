"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Key, CheckCircle2, XCircle, ArrowLeft, ShieldCheck, Mail, UserPlus } from "lucide-react";

interface StudentMember {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending";
  joinedAt: string;
  completedCount: number;
  avgScore: number;
}

const INITIAL_MEMBERS: StudentMember[] = [
  {
    id: "e0000000-0000-0000-0000-000000000002",
    name: "Trần Bình An",
    email: "student@mathlab.edu.vn",
    status: "active",
    joinedAt: "2026-10-06",
    completedCount: 4,
    avgScore: 8.5,
  },
  {
    id: "e0000000-0000-0000-0000-000000000003",
    name: "Lê Minh Khoa",
    email: "khoa.le@example.com",
    status: "active",
    joinedAt: "2026-10-06",
    completedCount: 3,
    avgScore: 9.0,
  },
  {
    id: "e0000000-0000-0000-0000-000000000004",
    name: "Phạm Thu Thảo",
    email: "thao.pham@example.com",
    status: "pending",
    joinedAt: "2026-10-07",
    completedCount: 0,
    avgScore: 0,
  },
];

export default function TeacherClassDetailsPage() {
  const [members, setMembers] = useState<StudentMember[]>(INITIAL_MEMBERS);

  const handleApprove = (id: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, status: "active" } : m))
    );
  };

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/teacher/classes"
            className="text-xs font-semibold text-slate-400 hover:text-white mb-2 inline-block transition-colors"
          >
            ← Quay lại Danh sách Lớp học
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Lớp Toán 8A1 - GDPT 2018</h1>
          <p className="text-sm font-medium text-slate-300 mt-1">
            Mã vào lớp: <span className="text-cyan-300 font-mono font-bold">MATH08</span> | Khối 8
          </p>
        </div>
      </div>

      {/* Roster Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Danh Sách Học Sinh Trong Lớp
          </h2>
          <span className="text-xs font-bold text-slate-400">
            Tổng số: {members.length} học sinh
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Họ và tên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Ngày tham gia</th>
                <th className="px-4 py-3">Điểm trung bình</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-4 font-bold text-white">{m.name}</td>
                  <td className="px-4 py-4 text-xs font-mono text-slate-400">{m.email}</td>
                  <td className="px-4 py-4 text-xs text-slate-400">{m.joinedAt}</td>
                  <td className="px-4 py-4">
                    <span className="font-bold text-indigo-300">
                      {m.avgScore > 0 ? `${m.avgScore} / 10` : "Chưa có"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        m.status === "active"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {m.status === "active" ? "Đã tham gia" : "Chờ duyệt"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {m.status === "pending" && (
                        <button
                          onClick={() => handleApprove(m.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm"
                        >
                          Duyệt vào lớp
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(m.id)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 font-semibold text-xs border border-slate-700 transition-all"
                      >
                        Xóa khỏi lớp
                      </button>
                    </div>
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
