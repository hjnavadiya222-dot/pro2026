"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { loginUser, registerStudent } from "@/lib/api";
import toast from "react-hot-toast";
import { Users, Eye, EyeOff, ArrowLeft, Loader2, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function StudentLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Signup state
  const [signupData, setSignupData] = useState({
    fullname: "", email: "", password: "", confirmPassword: "",
    department: "Information Technologies", semester: "3", phoneNumber: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) { toast.error("Please fill all fields."); return; }
    setLoading(true);
    try {
      const res = await loginUser({ email: loginData.email.trim(), password: loginData.password });
      const userData = res.data.user;
      if (userData.role === "Faculty" || userData.role === "Admin") {
        toast.error("This is for Students only. Use Faculty Login.");
        setLoading(false); return;
      }
      setUser(userData);
      toast.success(`Welcome, ${userData.fullname.split(" ")[0]}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed.";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullname, email, password, confirmPassword, department, semester, phoneNumber } = signupData;
    if (!fullname || !email || !password || !phoneNumber) { toast.error("Please fill all required fields."); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match."); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await registerStudent({ fullname, email: email.trim(), password, department, semester: Number(semester), phoneNumber });
      toast.success("Account created! Please sign in.");
      setTab("login");
      setLoginData({ email: email.trim(), password: "" });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed.";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-teal-500/60 focus:bg-white/10 transition-all";
  const labelCls = "text-white/50 text-xs tracking-wider uppercase";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden py-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-8 transition-colors w-fit">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_80px_rgba(20,184,166,0.1)]">
          {/* Header */}
          <div className="flex flex-col items-center pt-8 pb-4 px-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/40 mb-4">
              <Users size={26} />
            </div>
            <h1 className="text-xl font-bold tracking-widest uppercase">Student Portal</h1>
            <p className="text-white/30 text-xs mt-1 tracking-wider">SCET · Information Technologies</p>
          </div>

          {/* Tabs */}
          <div className="flex mx-6 mb-6 rounded-xl bg-white/5 border border-white/10 p-1 gap-1">
            {(["login", "signup"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${tab === t ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md" : "text-white/40 hover:text-white/70"}`}>
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div className="px-8 pb-8">
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Email</label>
                  <input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="your@email.com" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <input type={showPwd ? "text" : "password"} value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••" className={`${inputCls} pr-12`} />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold text-sm tracking-wider uppercase hover:from-teal-500 hover:to-blue-500 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Signing In...</> : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={labelCls}>Full Name *</label>
                  <input type="text" value={signupData.fullname} onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                    placeholder="Your full name" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Email *</label>
                  <input type="email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="your@email.com" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Semester *</label>
                    <select value={signupData.semester} onChange={(e) => setSignupData({ ...signupData, semester: e.target.value })}
                      className={`${inputCls} bg-zinc-900`}>
                      {[3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Phone *</label>
                    <input type="tel" value={signupData.phoneNumber} onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                      placeholder="10-digit" className={inputCls} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Password *</label>
                  <div className="relative">
                    <input type={showPwd ? "text" : "password"} value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="Min 6 characters" className={`${inputCls} pr-12`} />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Confirm Password *</label>
                  <input type="password" value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    placeholder="••••••••" className={inputCls} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold text-sm tracking-wider uppercase hover:from-teal-500 hover:to-blue-500 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : "Create Account"}
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-white/30 text-xs mb-3">Are you a faculty member?</p>
              <Link href="/faculty-login"
                className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
                <GraduationCap size={14} /> Go to Faculty Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
