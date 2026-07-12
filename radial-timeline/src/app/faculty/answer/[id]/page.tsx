"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getQuestionById, answerQuestion } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import toast from "react-hot-toast";
import { ArrowLeft, Send, Loader2, GraduationCap, Mail, Paperclip, CheckCircle2, Clock, X } from "lucide-react";

interface Question {
  _id: string;
  subject: string;
  questionTitle: string;
  questionText: string;
  status: "Pending" | "Answered";
  answerText?: string;
  answerFile?: { url: string };
  questionFile?: { url: string };
  studentId?: { fullname: string; email: string; semester?: number };
  createdAt: string;
}

export default function AnswerQuestionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [fetching, setFetching] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/faculty-login"); }, [user, loading, router]);

  useEffect(() => {
    if (id) {
      getQuestionById(id)
        .then((r) => {
          setQuestion(r.data);
          if (r.data.answerText) setAnswerText(r.data.answerText);
        })
        .catch(() => toast.error("Question not found."))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) { toast.error("Please write your answer."); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("answerText", answerText.trim());
      if (file) fd.append("answerFile", file);
      await answerQuestion(id, fd);
      toast.success("Answer submitted successfully!");
      router.push("/faculty/questions");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to submit answer.";
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  if (loading || !user || fetching) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!question) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/50">Question not found.</p>
        <button onClick={() => router.push("/faculty/questions")} className="mt-3 text-purple-400 text-sm hover:text-purple-300">← Back to questions</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-purple-600/5 blur-[100px]" />
      </div>
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back */}
        <button onClick={() => router.push("/faculty/questions")}
          className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to Questions
        </button>

        {/* Question Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6 mb-6">
          {/* Status & Subject */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
              question.status === "Answered"
                ? "text-teal-400 bg-teal-500/10 border-teal-500/30"
                : "text-amber-400 bg-amber-500/10 border-amber-500/30"
            }`}>
              {question.status === "Answered" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
              {question.status}
            </span>
            <span className="text-white/40 text-xs">{question.subject}</span>
          </div>

          {/* Student info */}
          {question.studentId && (
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4 bg-white/3 border border-white/5 rounded-xl p-3">
              <span className="flex items-center gap-1.5 text-white/60 text-xs">
                <GraduationCap size={12} className="text-purple-400" />
                <span className="font-medium text-white/80">{question.studentId.fullname}</span>
              </span>
              <a href={`mailto:${question.studentId.email}`}
                className="flex items-center gap-1.5 text-white/50 text-xs hover:text-teal-400 transition-colors">
                <Mail size={12} /> {question.studentId.email}
              </a>
              {question.studentId.semester && (
                <span className="text-white/40 text-xs">Semester {question.studentId.semester}</span>
              )}
            </div>
          )}

          {/* Question */}
          <h2 className="text-white text-lg sm:text-xl font-bold mb-3">{question.questionTitle}</h2>
          <p className="text-white/70 text-sm leading-relaxed bg-white/3 border border-white/5 rounded-xl p-4">{question.questionText}</p>

          {/* Attachment */}
          {question.questionFile?.url && (
            <a href={question.questionFile.url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-teal-400 text-xs hover:text-teal-300 underline">
              <Paperclip size={12} /> View student attachment
            </a>
          )}

          <p className="text-white/20 text-xs mt-4">
            Asked on {new Date(question.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Answer Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6">
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            {question.status === "Answered" ? (
              <><CheckCircle2 size={16} className="text-teal-400" /> Your Previous Answer</>
            ) : (
              <><Send size={15} className="text-purple-400" /> Write Your Answer</>
            )}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={8}
              placeholder="Provide a clear, detailed, and helpful answer. You can explain concepts, suggest approaches, or ask for clarification..."
              disabled={question.status === "Answered"}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all resize-none leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
            />

            {question.status !== "Answered" && (
              <div className="space-y-1.5 pb-2">
                <label className="text-white/50 text-xs tracking-wider uppercase font-medium">Attachment (optional)</label>
                {file ? (
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <Paperclip size={15} className="text-purple-400 shrink-0" />
                    <span className="text-white/70 text-sm truncate flex-1">{file.name}</span>
                    <button type="button" onClick={() => setFile(null)} className="text-white/30 hover:text-red-400 transition-colors shrink-0">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 bg-white/5 border border-dashed border-white/20 rounded-xl px-4 py-4 cursor-pointer hover:border-purple-500/50 hover:bg-white/8 transition-all group">
                    <Paperclip size={15} className="text-white/30 group-hover:text-purple-400 transition-colors shrink-0" />
                    <span className="text-white/30 text-sm group-hover:text-white/50 transition-colors">Click to attach an image or PDF</span>
                    <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
                  </label>
                )}
              </div>
            )}

            {question.status === "Answered" && question.answerFile?.url && (
              <div className="pb-4">
                <a href={question.answerFile.url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-teal-400 text-xs hover:text-teal-300 underline">
                  <Paperclip size={12} /> View attached answer file
                </a>
              </div>
            )}

            {question.status !== "Answered" && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={submitting || !answerText.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm tracking-wider uppercase hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Send size={15} /> Submit Answer</>}
                </button>
                <button type="button" onClick={() => router.push("/faculty/questions")}
                  className="sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/20 transition-all">
                  Cancel
                </button>
              </div>
            )}

            {question.status === "Answered" && (
              <div className="flex gap-3">
                <button type="button" onClick={() => router.push("/faculty/questions")}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/20 transition-all">
                  ← Back to Questions
                </button>
                <div className="flex items-center gap-1.5 text-teal-400 text-xs">
                  <CheckCircle2 size={14} /> This question is already answered
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
