"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSubjects, getFacultyBySubject, askQuestion } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import toast from "react-hot-toast";
import { HelpCircle, ChevronDown, Paperclip, Send, Loader2, X } from "lucide-react";

interface FacultyOption { _id: string; fullname: string; }

export default function AskQuestionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyOption[]>([]);
  const [form, setForm] = useState({ subject: "", facultyId: "", questionTitle: "", questionText: "" });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/student-login"); }, [user, loading, router]);

  useEffect(() => {
    if (user?.semester) {
      getSubjects(user.semester).then((r) => setSubjects(r.data.allSub || [])).catch(() => setSubjects([]));
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const facId = params.get("facultyId");
      const subj = params.get("subject");
      if (subj) {
        setForm((f) => ({
          ...f,
          subject: decodeURIComponent(subj),
          facultyId: facId || "",
        }));
      }
    }
  }, []);

  const fetchFaculty = useCallback(async (subject: string) => {
    if (!subject) { setFacultyList([]); return; }
    try {
      const r = await getFacultyBySubject(subject);
      setFacultyList(Array.isArray(r.data) ? r.data : []);
    } catch { setFacultyList([]); }
  }, []);

  useEffect(() => { fetchFaculty(form.subject); }, [form.subject, fetchFaculty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    if (!form.subject || !form.facultyId || !form.questionTitle || !form.questionText) {
      toast.error("Please fill all required fields."); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("studentId", user._id);
      fd.append("facultyId", form.facultyId);
      fd.append("subject", form.subject);
      fd.append("questionTitle", form.questionTitle);
      fd.append("questionText", form.questionText);
      if (file) fd.append("questionFile", file);
      await askQuestion(fd);
      toast.success("Question submitted successfully!");
      router.push("/dashboard/questions");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to submit.";
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-teal-500/60 focus:bg-white/8 transition-all";

  if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-600/5 blur-[100px]" />
      </div>
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-md">
            <HelpCircle size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Ask a Question</h1>
            <p className="text-white/40 text-xs mt-0.5">Get expert help from our faculty</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-white/50 text-xs tracking-wider uppercase font-medium">Subject *</label>
            <div className="relative">
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value, facultyId: "" })}
                className={`${inputCls} pr-10 appearance-none bg-zinc-900`}>
                <option value="">Select your subject</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Faculty */}
          <div className="space-y-1.5">
            <label className="text-white/50 text-xs tracking-wider uppercase font-medium">Select Faculty *</label>
            <div className="relative">
              <select value={form.facultyId} onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
                disabled={!form.subject || facultyList.length === 0}
                className={`${inputCls} pr-10 appearance-none bg-zinc-900 disabled:opacity-40`}>
                <option value="">{!form.subject ? "Select subject first" : facultyList.length === 0 ? "No faculty for this subject" : "Choose faculty"}</option>
                {facultyList.map((f) => <option key={f._id} value={f._id}>{f.fullname}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Question Title */}
          <div className="space-y-1.5">
            <label className="text-white/50 text-xs tracking-wider uppercase font-medium">Question Title *</label>
            <input type="text" value={form.questionTitle}
              onChange={(e) => setForm({ ...form, questionTitle: e.target.value })}
              placeholder="Clear and concise title (e.g. Difference between TCP and UDP?)"
              className={inputCls} maxLength={150} />
            <p className="text-white/20 text-xs text-right">{form.questionTitle.length}/150</p>
          </div>

          {/* Question Details */}
          <div className="space-y-1.5">
            <label className="text-white/50 text-xs tracking-wider uppercase font-medium">Question Details *</label>
            <textarea value={form.questionText}
              onChange={(e) => setForm({ ...form, questionText: e.target.value })}
              rows={6} placeholder="Describe your question in detail. The more context you provide, the better the answer you'll receive..."
              className={`${inputCls} resize-none leading-relaxed`} />
          </div>

          {/* File Attachment */}
          <div className="space-y-1.5">
            <label className="text-white/50 text-xs tracking-wider uppercase font-medium">Attachment (optional)</label>
            {file ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <Paperclip size={15} className="text-teal-400 shrink-0" />
                <span className="text-white/70 text-sm truncate flex-1">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-white/30 hover:text-red-400 transition-colors shrink-0">
                  <X size={15} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 bg-white/5 border border-dashed border-white/20 rounded-xl px-4 py-4 cursor-pointer hover:border-teal-500/50 hover:bg-white/8 transition-all group">
                <Paperclip size={15} className="text-white/30 group-hover:text-teal-400 transition-colors shrink-0" />
                <span className="text-white/30 text-sm group-hover:text-white/50 transition-colors">Click to attach an image or PDF</span>
                <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
              </label>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold text-sm tracking-wider uppercase hover:from-teal-500 hover:to-blue-500 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Send size={15} /> Submit Question</>}
          </button>
        </form>
      </main>
    </div>
  );
}
