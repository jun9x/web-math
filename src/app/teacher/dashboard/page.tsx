import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Users, FileQuestion, BookOpen, Sparkles, PlusCircle, Upload, MessageSquare, ShieldAlert, ArrowRight } from "lucide-react";

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch Teacher Stats
  const { count: classesCount } = await supabase
    .from("classes")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", user?.id || "");

  const { count: questionsCount } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user?.id || "");

  const { count: assignmentsCount } = await supabase
    .from("assignments")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", user?.id || "");

  const { data: recentAssignments } = await supabase
    .from("assignments")
    .select("id, title, mode, due_at, is_published, created_at")
    .eq("teacher_id", user?.id || "")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Bảng Điều Khiển Giáo Viên (Toán Lớp 8)</h1>
          <p className="text-sm font-medium text-slate-300 mt-1">
            Quản lý lớp học, soạn ngân hàng câu hỏi, tạo bài kiểm tra và theo dõi tiến độ học sinh
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            🎓 Chuyển sang Học sinh
          </Link>
          <Link
            href="/teacher/ai-chat"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Trợ lý Chat AI
          </Link>
          <Link
            href="/teacher/questions/ai"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Soạn câu hỏi AI
          </Link>
          <Link
            href="/teacher/assignments/new"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Tạo bài tập mới
          </Link>
        </div>
      </div>

      {/* Quick Access Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <Link
          href="/teacher/ai-chat"
          className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-purple-300 transition-colors">
              Trợ Lý Chat AI
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Tư vấn giáo án, gợi ý đề toán chuẩn GDPT 2018
            </p>
          </div>
        </Link>
        <Link
          href="/teacher/classes"
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 transition-colors">
              Quản Lý Lớp Học ({classesCount || 2})
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Tạo mã vào lớp, duyệt danh sách học sinh Lớp 8
            </p>
          </div>
        </Link>

        <Link
          href="/teacher/questions"
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
              Ngân Hàng Câu Hỏi ({questionsCount || 4})
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Trình soạn LaTeX có xem trước trực tiếp & phân loại GDPT 2018
            </p>
          </div>
        </Link>

        <Link
          href="/teacher/materials"
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
              Quản Lý Tài Liệu
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Đăng tải bài giảng PDF, video học tập cho học sinh
            </p>
          </div>
        </Link>

        <Link
          href="/teacher/ai-logs"
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all group space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">
              Nhật Ký Gia Sư AI
            </h3>
            <p className="text-xs font-medium text-slate-300 mt-1.5 leading-relaxed">
              Giám sát hội thoại Socratic AI & cảnh báo an toàn
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Assignments Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Bài giao & Bài kiểm tra gần đây
          </h2>
          <Link href="/teacher/assignments/new" className="text-xs font-bold text-indigo-400 hover:underline">
            + Tạo bài giao mới
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Tên bài giao</th>
                <th className="px-4 py-3">Chế độ</th>
                <th className="px-4 py-3">Hạn nộp</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-4 font-bold text-white">Bài Luyện Tập: Hằng Đẳng Thức & Phân Thức</td>
                <td className="px-4 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Luyện tập
                  </span>
                </td>
                <td className="px-4 py-4 text-xs font-medium text-slate-300">14 ngày tới</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300">
                    Đã phát hành
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Link href="/teacher/assignments/a0000000-0000-0000-0000-000000000001" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                    Xem kết quả & Chấm bài →
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-4 font-bold text-white">Bài Kiểm Tra 15 Phút - Toán Lớp 8 Giữa Kỳ</td>
                <td className="px-4 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Kiểm tra (Khóa AI)
                  </span>
                </td>
                <td className="px-4 py-4 text-xs font-medium text-slate-300">7 ngày tới</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300">
                    Đã phát hành
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Link href="/teacher/assignments/a0000000-0000-0000-0000-000000000002" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                    Xem kết quả & Chấm bài →
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
