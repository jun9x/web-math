import Link from "next/link";
import { Sparkles, GraduationCap, BrainCircuit, BookOpenCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { env } from "@/lib/env";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
              {env.NEXT_PUBLIC_APP_NAME}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900/0 to-slate-900" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Nền Tảng Dạy & Học Toán Lớp 8 Thế Hệ Mới
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
              Đột phá tư duy Toán Lớp 8 cùng <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">
                Gia sư AI Socrates & GDPT 2018
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Giải pháp học Toán Lớp 8 toàn diện (Hằng đẳng thức, Phân thức đại số, Hàm số bậc nhất, Hình học) tích hợp AI hướng dẫn tự học từng bước.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register?role=student"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                Vào học ngay <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register?role=teacher"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold transition-all flex items-center justify-center gap-2"
              >
                Dành cho Giáo viên
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 bg-slate-950/60 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Gia sư AI gợi mở Socrates</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Không chép lời giải có sẵn! AI hỏi gợi mở từng bước, nhắc kiến thức cũ và dẫn dắt học sinh tự tìm ra đáp án.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                  <BookOpenCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Chấm điểm & Phân tích lỗi</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Chấm biểu thức số học bằng mathjs chính xác. Nhận biết và phản hồi các lỗi sai phổ biến (misconception notes) của học sinh.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Lặp lại ngắt quãng & Cá nhân hóa</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Tự động đưa các câu từng sai vào lịch "Ôn tập hôm nay" giúp khắc sâu kiến thức dài hạn.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}. Chuẩn GDPT 2018 Việt Nam.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Chính sách quyền riêng tư</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
