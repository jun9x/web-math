import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Sparkles, Clock, BookMarked, PenTool, TrendingUp, Layers, ArrowRight } from "lucide-react";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch Published Assignments for Student's Joined Classes
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("class_id")
    .eq("student_id", user?.id || "")
    .eq("status", "active");

  const classIds = enrollments?.map((e) => e.class_id) || [];

  let assignments: any[] = [];
  if (classIds.length > 0) {
    const { data: assignData } = await supabase
      .from("assignments")
      .select("id, title, mode, due_at, time_limit_minutes, classes(name)")
      .in("class_id", classIds)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    assignments = assignData || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Góc Học Tập Toán Lớp 8</h1>
          <p className="text-sm font-medium text-slate-300 mt-1">
            Bộ công cụ hỗ trợ tự học, rèn luyện hằng đẳng thức & Gia sư AI Socrates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            👨‍🏫 Chuyển sang Giáo viên
          </Link>
          <Link
            href="/student/ai-chat"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Hỏi Đáp Gia Sư AI
          </Link>
          <Link
            href="/student/library"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <BookMarked className="w-4 h-4" /> Tra cứu công thức & Bảng nháp
          </Link>
        </div>
      </div>

      {/* Quick Learning Support Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <Link
          href="/student/ai-chat"
          className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/40 hover:border-cyan-400 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
              Học Cùng Gia Sư AI
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Hỏi đáp Socratic, gợi ý từng bước giải bài tập 8
            </p>
          </div>
        </Link>
        <Link
          href="/student/flashcards"
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">
              Thẻ Ôn Tập Flashcard
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Ôn ngắt quãng 7 Hằng đẳng thức & công thức Toán 8
            </p>
          </div>
        </Link>

        <Link
          href="/student/library?tab=cheatsheet"
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 transition-colors">
              Sổ Tay Công Thức 8
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Tra cứu nhanh lý thuyết, ví dụ & sao chép LaTeX
            </p>
          </div>
        </Link>

        <Link
          href="/student/library?tab=scratchpad"
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
              Bảng Nháp Vẽ Hình
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Vẽ hình học, nháp phép tính trực tiếp trên màn hình
            </p>
          </div>
        </Link>

        <Link
          href="/student/progress"
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
              Tiến Độ Cá Nhân
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Biểu đồ thành thục theo từng bài học & nhận xét AI
            </p>
          </div>
        </Link>
      </div>

      {/* Spaced Repetition Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Ôn Tập Lặp Thẻ Ngắt Quãng Hôm Nay</h3>
            <p className="text-xs font-medium text-slate-300 mt-1">
              Rèn luyện 5 thẻ kiến thức Hằng đẳng thức & Hàm số bậc nhất để duy trì chuỗi tư duy.
            </p>
          </div>
        </div>
        <Link
          href="/student/flashcards"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shrink-0 shadow-lg shadow-indigo-600/30"
        >
          Bắt đầu ôn thẻ ngay
        </Link>
      </div>

      {/* Assigned Homework & Tests */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Bài tập & Bài kiểm tra Toán 8
        </h2>

        {assignments.length === 0 ? (
          <div className="text-center py-12 text-slate-300 text-sm font-medium bg-slate-950/50 rounded-xl border border-slate-800/60">
            Hiện chưa có bài tập mới. Bạn có thể sử dụng các công cụ học tập ở trên để tự luyện!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((a) => (
              <div key={a.id} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      a.mode === "exam" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {a.mode === "exam" ? "Bài kiểm tra 15 phút" : "Luyện tập"}
                    </span>
                    <span className="text-xs font-medium text-slate-300">Lớp: {a.classes?.name || "Toán 8A1"}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{a.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-300 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {a.time_limit_minutes ? `${a.time_limit_minutes} phút` : "Không giới hạn thời gian"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/student/assignments/${a.id}`}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-indigo-600/20"
                >
                  Vào làm bài <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
