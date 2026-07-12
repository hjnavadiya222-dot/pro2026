"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getStudentQuestions } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import { MessageSquare, CheckCircle2, Clock, Search, ChevronRight, Paperclip } from "lucide-react";

interface Question {
  _id: string;
  subject: string;
  questionTitle: string;
  questionText: string;
  status: "Pending" | "Answered";
  answerText?: string;
  answerFile?: { url: string };
  questionFile?: { url: string };
  facultyId?: { fullname: string };
  createdAt: string;
}

interface QuestionsPageProps {
  filterStatus?: "Answered" | "Pending";
  pageTitle: string;
  pageDesc: string;
}

export function QuestionsListPage({ filterStatus, pageTitle, pageDesc }: QuestionsPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { if (!loading && !user) router.push("/student-login"); }, [user, loading, router]);

  useEffect(() => {
    if (user?._id) {
      getStudentQuestions(user._id)
        .then((r) => {
          const all: Question[] = r.data.questions || [];
          setQuestions(filterStatus ? all.filter((q) => q.status === filterStatus) : all);
        })
        .catch(() => setQuestions([]))
        .finally(() => setFetching(false));
    }
  }, [user, filterStatus]);

  const filtered = questions.filter((q) => {
    const s = search.toLowerCase();
    return (
      q.questionTitle.toLowerCase().includes(s) ||
      q.subject.toLowerCase().includes(s) ||
      (q.facultyId?.fullname || "").toLowerCase().includes(s)
    );
  });

  const icon = filterStatus === "Answered" ? CheckCircle2 : filterStatus === "Pending" ? Clock : MessageSquare;
  const color = filterStatus === "Answered" ? "teal" : filterStatus === "Pending" ? "amber" : "blue";

  if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" /></div>;

  const Icon = icon;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
            color === "teal" ? "bg-gradient-to-br from-teal-500 to-blue-600" :
            color === "amber" ? "bg-gradient-to-br from-amber-500 to-orange-600" :
            "bg-gradient-to-br from-blue-500 to-purple-600"
          }`}>
            <Icon size={19} />
          </div>
          <div>
            <h1 className="text-xl font-bold">{pageTitle}</h1>
            <p className="text-white/40 text-xs mt-0.5">{pageDesc}</p>
          </div>
        </div>

        {/* Search */}
        {questions.length > 0 && (
          <div className="relative mb-6">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" placeholder="Search by title, subject or faculty..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/50 transition-all" />
          </div>
        )}

        {/* Count */}
        {!fetching && (
          <p className="text-white/30 text-xs mb-4">{filtered.length} question{filtered.length !== 1 ? "s" : ""}{search ? " found" : ""}</p>
        )}

        {/* List */}
        {fetching ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/3">
            <Icon size={36} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">{search ? "No questions match your search." : `No ${filterStatus?.toLowerCase() ?? ""} questions yet.`}</p>
            {!filterStatus && (
              <button onClick={() => router.push("/dashboard/ask")} className="mt-4 px-4 py-2 rounded-xl bg-teal-600/20 text-teal-400 text-sm hover:bg-teal-600/30 transition-colors">
                Ask your first question
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((q) => (
              <div key={q._id} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <button onClick={() => setExpanded(expanded === q._id ? null : q._id)}
                  className="w-full p-4 sm:p-5 text-left hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          q.status === "Answered"
                            ? "text-teal-400 bg-teal-500/10 border-teal-500/30"
                            : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        }`}>
                          {q.status === "Answered" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          {q.status}
                        </span>
                        <span className="text-white/30 text-xs">{q.subject.split("(")[0].trim()}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">{q.questionTitle}</h3>
                      {q.facultyId && <p className="text-white/40 text-xs mt-0.5">→ {q.facultyId.fullname}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {q.questionFile?.url && <Paperclip size={13} className="text-white/30" />}
                      <ChevronRight size={15} className={`text-white/30 transition-transform ${expanded === q._id ? "rotate-90" : ""}`} />
                    </div>
                  </div>
                </button>

                {expanded === q._id && (
                  <div className="px-4 sm:px-5 pb-5 border-t border-white/10 space-y-4 pt-4">
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-medium">Your Question</p>
                      <p className="text-white/80 text-sm leading-relaxed bg-white/3 border border-white/5 rounded-xl p-4">{q.questionText}</p>
                    </div>
                    {q.questionFile?.url && (
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-medium">Attachment</p>
                        <a href={q.questionFile.url} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-teal-400 text-xs hover:text-teal-300 underline">
                          <Paperclip size={12} /> View attached file
                        </a>
                      </div>
                    )}
                    {q.answerText && (
                      <div>
                        <p className="text-teal-400 text-xs uppercase tracking-wider mb-2 font-semibold">Faculty Answer</p>
                        <div className="bg-teal-500/8 border border-teal-500/20 rounded-xl p-4">
                          <p className="text-white/80 text-sm leading-relaxed">{q.answerText}</p>
                          {q.answerFile?.url && (
                            <a href={q.answerFile.url} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1.5 mt-2 text-teal-400 text-xs hover:text-teal-300 underline block w-fit">
                              <Paperclip size={12} /> View attached answer
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-white/20 text-xs">{new Date(q.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
