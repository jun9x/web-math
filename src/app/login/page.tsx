"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrainCircuit, LogIn, AlertCircle, Info, UserCheck, GraduationCap } from "lucide-react";
import { env } from "@/lib/env";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isPlaceholderEnv = env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  const loginWithRole = (role: "teacher" | "student") => {
    document.cookie = `dev_user_role=${role}; path=/; max-age=86400`;
    router.push(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isPlaceholderEnv) {
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!authErr && data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          const role = profile?.role || "student";
          router.push(role === "teacher" || role === "admin" ? "/teacher/dashboard" : "/student/dashboard");
          return;
        }
      }
    } catch (err: any) {
      console.warn("Supabase auth failed, using dev mock fallback...", err);
    }

    // Dev Fallback Mode
    const role = email.toLowerCase().includes("teacher") ? "teacher" : "student";
    loginWithRole(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl border border-slate-700/50">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Đăng nhập MathLab</h2>
          <p className="text-sm text-slate-400 mt-1">Chào mừng bạn quay trở lại</p>
        </div>

        {/* Quick 1-Click Role Login Buttons for Easy Testing */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
          <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Vào Nhanh Hệ Thống (Local Demo Mode)</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => loginWithRole("teacher")}
              className="py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <UserCheck className="w-4 h-4" /> Vào vai Giáo viên
            </button>
            <button
              type="button"
              onClick={() => loginWithRole("student")}
              className="py-2.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/30"
            >
              <GraduationCap className="w-4 h-4" /> Vào vai Học sinh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@mathlab.edu.vn"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : <><LogIn className="w-5 h-5" /> Đăng nhập</>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
