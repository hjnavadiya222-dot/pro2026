"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getFacultyQuestions } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import { MessageSquare, CheckCircle2, Clock, HelpCircle, User, ChevronRight, GraduationCap } from "lucide-react";

interface Question {
  _id: string;
  subject: string;
  questionTitle: string;
  status: "Pending" | "Answered";
  studentId?: { fullname: string; semester?: number };
  createdAt: string;
}

export default function FacultyDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/faculty-login");
    if (!loading && user?.role === "Student") router.push("/dashboard");
  }, [user, loading, router]);

  useEffect(() => {
    if (user?._id && user.role === "Faculty") {
      getFacultyQuestions(user._id)
        .then((r) => setQuestions(r.data.questions || []))
        .catch(() => setQuestions([]))
        .finally(() => setFetching(false));
    } else if (user?.role === "Admin") {
      setFetching(false);
    }
  }, [user]);

  if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" /></div>;

  const total = questions.length;
  const answered = questions.filter(q => q.status === "Answered").length;
  const pending = questions.filter(q => q.status === "Pending").length;
  const recent = [...questions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const stats = [
    { label: "Total Questions", value: total, icon: MessageSquare, color: "blue" },
    { label: "Answered", value: answered, icon: CheckCircle2, color: "teal" },
    { label: "Pending", value: pending, icon: Clock, color: "amber" },
  ];

  const actions = [
    { label: "All Questions", desc: "View everything assigned to you", icon: MessageSquare, href: "/faculty/questions", gradient: "from-blue-600 to-purple-600" },
    { label: "Pending", desc: "Questions awaiting your answer", icon: Clock, href: "/faculty/questions/pending", gradient: "from-amber-600 to-orange-600", badge: pending > 0 ? pending : undefined },
    { label: "Answered", desc: "Questions you have resolved", icon: CheckCircle2, href: "/faculty/questions/solved", gradient: "from-teal-600 to-blue-600" },
    { label: "My Profile", desc: "Update your information", icon: User, href: "/faculty/profile", gradient: "from-zinc-600 to-zinc-500" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-purple-600/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[100px]" />
      </div>
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{user.fullname}</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {user.designation || "Faculty"} · {user.department}
          </p>
          {pending > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-1.5 text-amber-400 text-xs font-medium">
              <Clock size={12} className="animate-pulse" />
              {pending} question{pending > 1 ? "s" : ""} awaiting your response
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                color === "blue" ? "bg-blue-500/15 text-blue-400" :
                color === "teal" ? "bg-teal-500/15 text-teal-400" : "bg-amber-500/15 text-amber-400"
              }`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{fetching ? "—" : value}</p>
              <p className="text-white/40 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-white/60 text-xs tracking-widest uppercase mb-4 font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {actions.map(({ label, desc, icon: Icon, href, gradient, badge }) => (
            <button key={href} onClick={() => router.push(href)}
              className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-5 text-left hover:border-white/20 hover:bg-white/8 transition-all duration-200">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon size={16} className="text-white" />
              </div>
              {badge !== undefined && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
              <p className="text-white text-sm font-semibold">{label}</p>
              <p className="text-white/40 text-xs mt-0.5">{desc}</p>
              <ChevronRight size={13} className="text-white/20 mt-2 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>

        {/* Recent Questions */}
        {recent.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white/60 text-xs tracking-widest uppercase font-semibold">Recent Student Questions</h2>
              <button onClick={() => router.push("/faculty/questions")} className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {recent.map((q) => (
                <button key={q._id} onClick={() => router.push(`/faculty/answer/${q._id}`)}
                  className="w-full text-left rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-4 hover:border-purple-500/30 hover:bg-white/8 transition-all group">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{q.questionTitle}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-white/40 text-xs truncate">{q.subject.split("(")[0].trim()}</p>
                      {q.studentId && (
                        <span className="flex items-center gap-1 text-white/30 text-xs shrink-0">
                          <GraduationCap size={10} /> {q.studentId.fullname?.split(" ")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      q.status === "Answered"
                        ? "text-teal-400 bg-teal-500/10 border-teal-500/30"
                        : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                    }`}>
                      {q.status}
                    </span>
                    <HelpCircle size={14} className="text-white/20 group-hover:text-purple-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
