import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetFacultyQuestions } from "@/hooks/useGetFacultyQuestions";
import { Navbar } from "../pages/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MessageCircle, User, Mail, Clock, Search, GraduationCap } from "lucide-react";

// Define status colors with new theme
const statusColors = {
  Answered: "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30",
  Pending: "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30",
};

export default function FacultyAllQuestion() {
  useGetFacultyQuestions(); // Fetch questions
  const questions = useSelector((state) => state.auth.questions) || [];

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter based on search query
  const filteredQuestions = questions.filter((q) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (q.subject || "").toLowerCase().includes(query) ||
      (q.questionTitle || "").toLowerCase().includes(query) ||
      (q.questionText || "").toLowerCase().includes(query) ||
      (q.studentId?.fullname || "").toLowerCase().includes(query) ||
      (q.studentId?.email || "").toLowerCase().includes(query)
    );
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-zinc-900 to-rose-500/5" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 opacity-20 blur-3xl">
          <div className="absolute h-full w-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30" />
        </div>
      </div>

      <div className="container mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-rose-400 mb-3">
            Faculty Questions
          </h1>
          <p className="text-zinc-400 text-lg">View student questions</p>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-rose-500 mx-auto mt-4"></div>
        </motion.div>

        {/* Search Bar */}
        {questions.length > 0 && (
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search doubts by title, subject, student name..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {questions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <p className="text-zinc-400 text-lg">No questions available.</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : filteredQuestions.length === 0 ? (
          <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm text-center p-8 max-w-2xl mx-auto">
            <p className="text-zinc-400 text-lg">No questions match your search.</p>
          </Card>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 max-w-4xl mx-auto"
          >
            {filteredQuestions.map((question) => (
              <motion.div key={question._id} variants={itemVariants}>
                <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all shadow-md">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Subject and Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                            <MessageCircle className="h-5 w-5" />
                          </div>
                          <h3 className="text-xl font-semibold text-zinc-100">{question.subject}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${statusColors[question?.status]} text-sm px-4 py-1 border border-zinc-700/30`}>
                            {question?.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Student Info Card */}
                      {question.studentId && (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400 bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-emerald-500" />
                            <span className="font-medium text-zinc-300">Student: </span>
                            <span>{question.studentId.fullname}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-zinc-500" />
                            <span className="font-medium text-zinc-300">Email: </span>
                            <a href={`mailto:${question.studentId.email}`} className="hover:underline text-emerald-400">
                              {question.studentId.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-zinc-500" />
                            <span className="font-medium text-zinc-300">Semester: </span>
                            <span>{question.studentId.semester}</span>
                          </div>
                        </div>
                      )}

                      {/* Question Title */}
                      <div className="pl-1">
                        <p className="text-lg text-zinc-100 font-medium">{question.questionTitle}</p>
                      </div>

                      {/* Question Text Section */}
                      <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                        <p className="text-zinc-300 leading-relaxed">
                          {question?.questionText || "No question text provided."}
                        </p>
                      </div>

                      {/* Answer Section if solved */}
                      {question.status === "Answered" && question.answerText && (
                        <div className="pl-1">
                          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
                            <h4 className="text-emerald-400 font-semibold mb-2">Answer:</h4>
                            <p className="text-zinc-300 leading-relaxed">{question.answerText}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
