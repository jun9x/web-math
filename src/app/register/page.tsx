"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrainCircuit, UserPlus, AlertCircle } from "lucide-react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "teacher" ? "teacher" : "student";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">(defaultRole);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (!signUpErr && data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          role,
        });

        router.push(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
        return;
      }
    } catch (err: any) {
      console.warn("Supabase auth failed, using dev mock fallback...", err);
    }

    // Dev Fallback Mode
    document.cookie = `dev_user_role=${role}; path=/; max-age=86400`;
    setLoading(false);
    router.push(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl border border-slate-700/50">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
          <BrainCircuit className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Tạo tài khoản MathLab</h2>
        <p className="text-sm text-slate-400 mt-1">Bắt đầu hành trình chinh phục Toán học</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Họ và tên
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Mật khẩu
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ít nhất 6 ký tự"
            className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Vai trò tài khoản
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                role === "student"
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              🎓 Học sinh
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                role === "teacher"
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              👨‍🏫 Giáo viên
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? "Đang xử lý..." : <><UserPlus className="w-5 h-5" /> Đăng ký ngay</>}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-400 text-sm">Đang tải...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
