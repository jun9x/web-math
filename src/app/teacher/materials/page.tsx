"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Video, ExternalLink, Trash2, Search, Upload, ArrowLeft } from "lucide-react";

interface MaterialItem {
  id: string;
  title: string;
  kind: "pdf" | "video" | "link" | "image";
  topicName: string;
  grade: number;
  uploadedAt: string;
}

const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: "m-1",
    title: "Chuyên Đề 7 Hằng Đẳng Thức Đáng Nhớ & Bài Tập 8",
    kind: "pdf",
    topicName: "Các Hằng đẳng thức đáng nhớ",
    grade: 8,
    uploadedAt: "2026-10-06",
  },
  {
    id: "m-2",
    title: "Video Bài Giảng: Phương Trình Bậc Nhất Một Ẩn",
    kind: "video",
    topicName: "Phương trình bậc nhất một ẩn",
    grade: 8,
    uploadedAt: "2026-10-07",
  },
];

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [kindInput, setKindInput] = useState<"pdf" | "video" | "link" | "image">("pdf");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    const newMat: MaterialItem = {
      id: `m-${Date.now()}`,
      title: titleInput.trim(),
      kind: kindInput,
      topicName: "Toán Lớp 8",
      grade: 8,
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    setMaterials([newMat, ...materials]);
    setTitleInput("");
    setShowUploadModal(false);
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/teacher/dashboard"
            className="text-xs font-semibold text-slate-400 hover:text-white mb-2 inline-block transition-colors"
          >
            ← Quay lại Bảng điều khiển
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Quản Lý Tài Liệu Học Tập</h1>
          <p className="text-sm font-medium text-slate-300 mt-1">
            Đăng tải và chia sẻ bài giảng PDF, video học tập cho học sinh Lớp 8
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Tải Lên Tài Liệu Mới
        </button>
      </div>

      {/* Materials List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.map((mat) => (
          <div
            key={mat.id}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4 shadow-xl relative group"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                {mat.topicName}
              </span>
              <button
                onClick={() => handleDelete(mat.id)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-all"
                title="Xóa tài liệu"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                {mat.kind === "pdf" ? <FileText className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {mat.title}
                </h3>
                <div className="text-xs text-slate-400">Đăng ngày: {mat.uploadedAt}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <a
                href="#"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                Xem chi tiết tài liệu <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">Tải Lên Tài Liệu Mới</h3>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tên tài liệu
                </label>
                <input
                  type="text"
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Ví dụ: Chuyên Đề 7 Hằng Đẳng Thức Đáng Nhớ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Loại tài liệu
                </label>
                <select
                  value={kindInput}
                  onChange={(e) => setKindInput(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="pdf">Tệp PDF Bài Giảng</option>
                  <option value="video">Video Bài Giảng</option>
                  <option value="link">Liên kết ngoài</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Tải lên ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
