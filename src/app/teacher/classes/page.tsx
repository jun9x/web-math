"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Plus, Key, CheckCircle, ShieldAlert, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { generateJoinCode } from "@/lib/utils";
import { INITIAL_CLASSES, type ClassItem } from "@/lib/store/demoData";

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classNameInput, setClassNameInput] = useState("");
  const [gradeInput, setGradeInput] = useState(8);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim()) return;

    const newClass: ClassItem = {
      id: `c-${Date.now()}`,
      name: classNameInput.trim(),
      grade: gradeInput,
      joinCode: generateJoinCode(),
      studentCount: 0,
      isOpenEnrollment: true,
      teacherName: "Giáo viên Demo",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setClasses([newClass, ...classes]);
    setClassNameInput("");
    setShowCreateModal(false);
  };

  const handleRegenerateCode = (classId: string) => {
    const newCode = generateJoinCode();
    setClasses(
      classes.map((c) => (c.id === classId ? { ...c, joinCode: newCode } : c))
    );
  };

  const handleToggleEnrollment = (classId: string) => {
    setClasses(
      classes.map((c) =>
        c.id === classId ? { ...c, isOpenEnrollment: !c.isOpenEnrollment } : c
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/teacher/dashboard"
            className="text-xs font-semibold text-slate-400 hover:text-white mb-2 inline-block transition-colors"
          >
            ← Quay lại Bảng điều khiển
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Quản Lý Lớp Học</h1>
          <p className="text-sm font-medium text-slate-300 mt-1">
            Tạo lớp mới, quản lý mã tham gia và danh sách học sinh Lớp 8
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tạo Lớp Học Mới
        </button>
      </div>

      {/* Class List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-5 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  Toán Lớp {cls.grade}
                </span>
                <button
                  onClick={() => handleToggleEnrollment(cls.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                    cls.isOpenEnrollment
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {cls.isOpenEnrollment ? "Đang mở tham gia" : "Đã khóa lớp"}
                </button>
              </div>

              <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                {cls.name}
              </h3>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Sĩ số: <strong className="text-white font-bold">{cls.studentCount} học sinh</strong></span>
              </div>
            </div>

            {/* Join Code Display */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Mã vào lớp học sinh:</span>
                <button
                  onClick={() => handleRegenerateCode(cls.id)}
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                  title="Đổi mã ngẫu nhiên"
                >
                  <Key className="w-3 h-3" /> Đổi mã
                </button>
              </div>
              <div className="text-2xl font-black text-cyan-300 tracking-widest text-center font-mono">
                {cls.joinCode}
              </div>
            </div>

            <Link
              href={`/teacher/classes/${cls.id}`}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all text-center flex items-center justify-center gap-1.5"
            >
              Quản lý danh sách học sinh <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">Tạo Lớp Học Mới</h3>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tên lớp học
                </label>
                <input
                  type="text"
                  required
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  placeholder="Ví dụ: Lớp Toán 8A3 - GDPT 2018"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Khối Lớp
                </label>
                <select
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value={8}>Toán Lớp 8 (GDPT 2018)</option>
                  <option value={6}>Toán Lớp 6</option>
                  <option value={7}>Toán Lớp 7</option>
                  <option value={9}>Toán Lớp 9</option>
                  <option value={10}>Toán Lớp 10</option>
                  <option value={11}>Toán Lớp 11</option>
                  <option value={12}>Toán Lớp 12</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Tạo lớp ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
