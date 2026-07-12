"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { GraduationCap, Users, ChevronRight, Layers, HelpCircle, Send } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect logged-in users to their respective dashboards
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "Faculty") router.push("/faculty/dashboard");
      else if (user.role === "Student") router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: `${Math.random()*2+1}px`, height: `${Math.random()*2+1}px`, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, opacity: Math.random()*0.5+0.1 }} />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-16 pb-10 px-4">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-400 flex items-center justify-center animate-pulse">
            <Layers size={14} />
          </div>
          <span className="text-white/40 text-xs tracking-[0.3em] uppercase">Sarvajanik College of Engineering & Technology</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
          AskVerse
        </h1>
        <p className="text-white/40 text-sm mt-2 tracking-wider">Information Technologies Department Portal · Ask · Learn · Grow</p>
      </header>

      {/* Login Cards */}
      <section className="relative z-10 flex flex-col sm:flex-row gap-5 justify-center items-stretch px-6 pb-16 max-w-2xl mx-auto">
        {/* Faculty Login */}
        <button onClick={() => router.push("/faculty-login")}
          className="group flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 flex flex-col items-center gap-4 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-400 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] cursor-pointer text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
            <GraduationCap size={26} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-widest uppercase">Faculty Login</h2>
            <p className="text-white/40 text-xs mt-0.5">Access faculty portal</p>
          </div>
          <span className="flex items-center gap-1 text-purple-400 text-xs font-semibold tracking-wider group-hover:gap-2 transition-all">
            Sign In <ChevronRight size={13} />
          </span>
        </button>

        <div className="hidden sm:flex flex-col items-center gap-2 py-4">
          <div className="w-px flex-1 bg-white/10" />
          <span className="text-white/20 text-xs">OR</span>
          <div className="w-px flex-1 bg-white/10" />
        </div>

        {/* Student Login */}
        <button onClick={() => router.push("/student-login")}
          className="group flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 flex flex-col items-center gap-4 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all duration-400 hover:shadow-[0_0_50px_rgba(20,184,166,0.2)] cursor-pointer text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
            <Users size={26} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-widest uppercase">Student Login</h2>
            <p className="text-white/40 text-xs mt-0.5">Access student portal</p>
          </div>
          <span className="flex items-center gap-1 text-teal-400 text-xs font-semibold tracking-wider group-hover:gap-2 transition-all">
            Sign In <ChevronRight size={13} />
          </span>
        </button>
      </section>

      {/* How to Use Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-white text-lg font-bold tracking-[0.2em] uppercase mb-1">How it works</h2>
          <p className="text-white/40 text-xs">A comprehensive and secure workflow for the department portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Guide */}
          <div className="rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm p-6 space-y-4">
            <h3 className="text-teal-400 font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <HelpCircle size={16} /> Student Workflow
            </h3>
            <div className="space-y-4">
              {[
                { step: "01", title: "Secure Registration", desc: "Sign up and log in using your student credentials. Be sure to select your correct semester so that the portal matches your exact curriculum." },
                { step: "02", title: "Explore Directory", desc: "Browse through the Faculty Directory, search by teacher name, designation, or specific subjects, and view detailed qualifications and experience." },
                { step: "03", title: "Submit Doubts & Files", desc: "Compose your question, select the dynamic subject, and pick the corresponding teaching faculty. Attach reference materials (images or PDFs) to clarify your issue." },
                { step: "04", title: "Track Responses", desc: "View pending queries and review completed answers with detailed text resolutions and documents sent back by faculty directly on your portal dashboard." }
              ].map((item) => (
                <div key={item.step} className="flex gap-3.5 items-start">
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded shrink-0">{item.step}</span>
                  <div>
                    <h4 className="text-white/80 text-xs font-bold">{item.title}</h4>
                    <p className="text-white/40 text-xs leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Guide */}
          <div className="rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm p-6 space-y-4">
            <h3 className="text-purple-400 font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <Send size={15} /> Faculty Workflow
            </h3>
            <div className="space-y-4">
              {[
                { step: "01", title: "Authorized Staff Login", desc: "Log in securely using your registered staff credentials to access the academic workspace dashboards." },
                { step: "02", title: "Dashboard Overview", desc: "Instantly check visual stats representing total assigned queries, currently pending issues, and resolved questions." },
                { step: "03", title: "Detailed Solutions", desc: "Open pending queries, read student descriptions, view attachments, and write detailed solutions. Click to attach reference files (images or PDFs)." },
                { step: "04", title: "Manage Professional profile", desc: "Edit qualifications, update designations, and list teaching experience to make the directory helpful and informative for students." }
              ].map((item) => (
                <div key={item.step} className="flex gap-3.5 items-start">
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded shrink-0">{item.step}</span>
                  <div>
                    <h4 className="text-white/80 text-xs font-bold">{item.title}</h4>
                    <p className="text-white/40 text-xs leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
