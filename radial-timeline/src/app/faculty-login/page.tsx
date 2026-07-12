"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { loginUser } from "@/lib/api";
import toast from "react-hot-toast";
import { GraduationCap, Eye, EyeOff, ArrowLeft, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";

export default function FacultyLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { toast.error("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await loginUser({ email: email.trim(), password });
      const userData = res.data.user;
      if (userData.role !== "Faculty" && userData.role !== "Admin") {
        toast.error("This login is for Faculty only. Please use Student login.");
        setLoading(false);
        return;
      }
      setUser(userData);
      toast.success(`Welcome back, ${userData.fullname.split(" ")[0]}!`);
      router.push(userData.role === "Admin" ? "/admin" : "/faculty/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed. Check your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-8 transition-colors w-fit">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_80px_rgba(139,92,246,0.12)]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/40 mb-4">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-xl font-bold tracking-widest uppercase">Faculty Login</h1>
            <p className="text-white/30 text-xs mt-1 tracking-wider">SCET · Information Technologies</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs tracking-wider uppercase" htmlFor="faculty-email">Email</label>
              <input id="faculty-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@scet.ac.in"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/50 text-xs tracking-wider uppercase" htmlFor="faculty-pwd">Password</label>
              <div className="relative">
                <input id="faculty-pwd" type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all" />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm tracking-wider uppercase hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing In...</> : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-white/30 text-xs mb-3">New faculty member?</p>
            <Link href="/faculty/signup"
              className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              <UserPlus size={14} /> Register as Faculty
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
