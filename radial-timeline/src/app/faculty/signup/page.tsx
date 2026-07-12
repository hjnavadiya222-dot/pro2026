"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerFaculty } from "@/lib/api";
import toast from "react-hot-toast";
import { GraduationCap, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const designations = [
  "Professor", "Associate Professor", "Assistant Professor",
  "Assistant Professor (Senior Grade)", "Assistant Professor (Contractual)",
];

export default function FacultySignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "", email: "", password: "", confirmPassword: "",
    designation: "", department: "Information Technologies",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullname, email, password, confirmPassword, designation, department } = form;
    if (!fullname || !email || !password || !designation) { toast.error("Please fill all required fields."); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match."); return; }
    if (!email.endsWith("@scet.ac.in")) { toast.error("Only @scet.ac.in emails are allowed for faculty."); return; }
    setLoading(true);
    try {
      await registerFaculty({ fullname, email: email.trim(), password, designation, department });
      toast.success("Registered successfully! Please sign in.");
      router.push("/faculty-login");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed.";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/faculty-login" className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-8 transition-colors w-fit">
          <ArrowLeft size={15} /> Back to Faculty Login
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_0_80px_rgba(139,92,246,0.1)]">
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/40 mb-3">
              <GraduationCap size={26} />
            </div>
            <h1 className="text-xl font-bold tracking-widest uppercase">Faculty Registration</h1>
            <p className="text-white/30 text-xs mt-1 tracking-wider">Must use official @scet.ac.in email</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs tracking-wider uppercase">Full Name *</label>
              <input type="text" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                placeholder="As per faculty records" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs tracking-wider uppercase">Official Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="yourname@scet.ac.in" className={inputCls} />
              <p className="text-white/20 text-xs pl-1">Your email must be pre-registered by Admin</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs tracking-wider uppercase">Designation *</label>
              <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className={`${inputCls} bg-zinc-900`}>
                <option value="">Select designation</option>
                {designations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs tracking-wider uppercase">Password *</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters" className={`${inputCls} pr-12`} />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs tracking-wider uppercase">Confirm Password *</label>
              <input type="password" value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••" className={inputCls} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm tracking-wider uppercase hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Registering...</> : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
