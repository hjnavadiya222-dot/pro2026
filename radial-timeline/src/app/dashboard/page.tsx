"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getStudentQuestions, getAllFaculty } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import {
  MessageSquare, CheckCircle2, Clock, HelpCircle,
  BookOpen, User, TrendingUp, ChevronRight,
  Star, Award, Mail, Search, ChevronDown, GraduationCap,
} from "lucide-react";

interface Question {
  _id: string;
  subject: string;
  questionTitle: string;
  status: "Pending" | "Answered";
  createdAt: string;
  facultyId?: { fullname: string };
}

interface Faculty {
  _id: string;
  fullname: string;
  designation?: string;
  qualification?: string;
  experience?: string;
  email: string;
  subject?: string[];
  portfolio?: string;
  profile?: { profilePicture?: { url: string } };
}

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetching, setFetching] = useState(true);

  // Faculty Directory State
  const [listOpen, setListOpen] = useState(false);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [selected, setSelected] = useState<Faculty | null>(null);
  const [search, setSearch] = useState("");
  const [fetchingFaculty, setFetchingFaculty] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/student-login");
    if (!loading && user?.role === "Faculty") router.push("/faculty/dashboard");
  }, [user, loading, router]);

  useEffect(() => {
    if (user?._id) {
      getStudentQuestions(user._id)
        .then((res) => setQuestions(res.data.questions || []))
        .catch(() => setQuestions([]))
        .finally(() => setFetching(false));
    }
  }, [user]);

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== "undefined" && window.location.hash === "#directory-section") {
        loadFaculty(true);
        setTimeout(() => {
          document.getElementById("directory-section")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [user, faculty]);

  const loadFaculty = async (forceOpen = false) => {
    if (faculty.length > 0) {
      if (forceOpen) setListOpen(true);
      else setListOpen((v) => !v);
      return;
    }
    setFetchingFaculty(true);
    try {
      const res = await getAllFaculty();
      setFaculty(res.data as Faculty[]);
    } catch {
      setFaculty([]);
    } finally {
      setFetchingFaculty(false);
      setListOpen(true);
    }
  };

  const filteredFaculty = faculty.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.fullname.toLowerCase().includes(q) ||
      (f.designation || "").toLowerCase().includes(q) ||
      (f.subject || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  const initials = (name: string) =>
    name.split(" ").filter((w) => !["Prof.", "Dr.", "Ms.", "(Dr.)"].includes(w)).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  if (loading || !user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  );

  const total = questions.length;
  const answered = questions.filter((q) => q.status === "Answered").length;
  const pending = questions.filter((q) => q.status === "Pending").length;
  const recent = [...questions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const stats = [
    { label: "Total Questions", value: total, icon: MessageSquare, color: "blue" },
    { label: "Answered", value: answered, icon: CheckCircle2, color: "teal" },
    { label: "Pending", value: pending, icon: Clock, color: "amber" },
  ];

  const actions = [
    { label: "Ask a Question", desc: "Get help from faculty", icon: HelpCircle, onClick: () => router.push("/dashboard/ask"), gradient: "from-teal-600 to-blue-600" },
    { label: "All Questions", desc: "View everything you asked", icon: MessageSquare, onClick: () => router.push("/dashboard/questions"), gradient: "from-blue-600 to-purple-600" },
    { label: "Solved", desc: "Browse answered queries", icon: CheckCircle2, onClick: () => router.push("/dashboard/solved"), gradient: "from-green-600 to-teal-600" },
    { label: "Pending", desc: "Questions awaiting answer", icon: Clock, onClick: () => router.push("/dashboard/unsolved"), gradient: "from-amber-600 to-orange-600" },
    { label: "Faculty Directory", desc: "Find & contact faculty", icon: BookOpen, onClick: () => { loadFaculty(); setTimeout(() => { document.getElementById("directory-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }, gradient: "from-purple-600 to-blue-600" },
    { label: "My Profile", desc: "View & edit your profile", icon: User, onClick: () => router.push("/dashboard/profile"), gradient: "from-zinc-600 to-zinc-500" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-teal-600/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">{user.fullname}</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Sem {user.semester} · {user.department} · {fetching ? "Loading..." : `${total} question${total !== 1 ? "s" : ""} asked`}
          </p>
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
              <p className="text-2xl sm:text-3xl font-bold text-white">{fetching ? "—" : value}</p>
              <p className="text-white/40 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-white/60 text-xs tracking-widest uppercase mb-4 font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {actions.map(({ label, desc, icon: Icon, onClick, gradient }) => (
            <button key={label} onClick={onClick}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-5 text-left hover:border-white/20 hover:bg-white/8 transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={16} className="text-white" />
              </div>
              <p className="text-white text-sm font-semibold leading-tight">{label}</p>
              <p className="text-white/40 text-xs mt-0.5">{desc}</p>
              <ChevronRight size={13} className="text-white/20 mt-2 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>

        {/* Recent Questions */}
        {recent.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white/60 text-xs tracking-widest uppercase font-semibold">Recent Questions</h2>
              <button onClick={() => router.push("/dashboard/questions")} className="text-teal-400 text-xs hover:text-teal-300 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {recent.map((q) => (
                <div key={q._id} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{q.questionTitle}</p>
                    <p className="text-white/40 text-xs mt-0.5 truncate">{q.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      q.status === "Answered"
                        ? "text-teal-400 bg-teal-500/10 border-teal-500/30"
                        : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                    }`}>
                      {q.status === "Answered" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {q.status}
                    </span>
                    <TrendingUp size={12} className="text-white/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Faculty Directory Section */}
        <div id="directory-section" className="border-t border-white/10 pt-12">
          <div className="flex flex-col items-center">
            {/* Single Orb */}
            <div className="relative flex flex-col items-center mb-8">
              <div className="absolute w-40 h-40 rounded-full border border-white/5 animate-ping opacity-10" />
              <div className="absolute w-32 h-32 rounded-full border border-white/10 animate-ping opacity-20" style={{ animationDelay: "0.7s" }} />
              <button onClick={() => loadFaculty()}
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-400 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.4)] hover:shadow-[0_0_90px_rgba(139,92,246,0.65)] transition-all duration-500 cursor-pointer z-10 group">
                <div className="absolute inset-1 rounded-full bg-black/40 backdrop-blur-sm" />
                {fetchingFaculty ? (
                  <div className="relative z-10 w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <BookOpen size={22} className="relative z-10 text-white mb-0.5" />
                    <span className="relative z-10 text-[9px] font-bold tracking-widest text-white/80 uppercase">
                      {listOpen ? "Close" : "Directory"}
                    </span>
                  </>
                )}
              </button>
              {listOpen && <div className="w-px h-6 bg-gradient-to-b from-purple-500/50 to-transparent mt-1" />}
              <p className="mt-3 text-white/30 text-xs tracking-wider">
                {listOpen ? "Click to collapse" : "Tap directory orb to explore faculty"}
              </p>
            </div>

            {/* Live Faculty List */}
            {listOpen && (
              <div className="w-full">
                {/* Search */}
                <div className="relative max-w-md mx-auto mb-6">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search by name, designation, subject..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition-all"
                  />
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-8 mb-6 text-center">
                  {[
                    { label: "Total Faculty", value: faculty.length, icon: Star },
                    { label: "Professors", value: faculty.filter(f => f.designation?.includes("Professor") && !f.designation?.includes("Asst") && !f.designation?.includes("Associate")).length, icon: Award },
                    { label: "PhDs", value: faculty.filter(f => f.fullname.includes("Dr.") || f.fullname.includes("(Dr.)") || f.qualification?.includes("Ph.D")).length, icon: GraduationCap },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <Icon size={13} className="text-white/30" />
                      <span className="text-xl font-bold text-white">{value}</span>
                      <span className="text-white/30 text-[10px] tracking-wider uppercase">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-1">
                  {filteredFaculty.map((f) => (
                    <div key={f._id}
                      onClick={() => setSelected(selected?._id === f._id ? null : f)}
                      className="cursor-pointer text-left rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:border-purple-500/30 hover:bg-white/8 transition-all duration-200 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                      <div className="flex items-start gap-3">
                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                          f.designation?.includes("Head") || f.portfolio?.includes("Head")
                            ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                            : f.designation?.includes("Associate")
                            ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                            : "bg-gradient-to-br from-blue-600 to-teal-600"
                        }`}>
                          {f.profile?.profilePicture?.url && !f.profile.profilePicture.url.includes("encrypted-tbn0") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={f.profile.profilePicture.url} alt={f.fullname} className="w-full h-full rounded-full object-cover" />
                          ) : initials(f.fullname)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-white text-sm font-semibold leading-tight">{f.fullname}</h3>
                            {(f.portfolio?.includes("Head") || f.designation?.includes("Head")) && (
                              <span className="text-[9px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-1.5 py-0.5 font-bold">HoD</span>
                            )}
                          </div>
                          <p className="text-white/50 text-xs mt-0.5">{f.designation || "Faculty"}</p>
                          {f.experience && <p className="text-white/30 text-xs">{f.experience} experience</p>}
                        </div>
                        <ChevronDown size={14} className={`text-white/30 shrink-0 transition-transform mt-1 ${selected?._id === f._id ? "rotate-180" : ""}`} />
                      </div>

                      {selected?._id === f._id && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-left animate-fadeIn">
                          {f.qualification && (
                            <div className="flex items-start gap-2">
                              <Award size={11} className="text-purple-400 mt-0.5 shrink-0" />
                              <span className="text-white/60 text-xs">{f.qualification}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Mail size={11} className="text-teal-400 shrink-0" />
                            <a href={`mailto:${f.email}`} onClick={(e) => e.stopPropagation()}
                              className="text-teal-400 text-xs hover:text-teal-300 underline underline-offset-2 transition-colors truncate">
                              {f.email}
                            </a>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const firstSubject = f.subject && f.subject.length > 0 ? f.subject[0] : "";
                              router.push(`/dashboard/ask?facultyId=${f._id}&subject=${encodeURIComponent(firstSubject)}`);
                            }}
                            className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/10"
                          >
                            <MessageSquare size={12} /> Ask Question
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {search && filteredFaculty.length === 0 && (
                    <div className="col-span-full text-center text-white/30 py-10 text-sm">No faculty match your search.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
