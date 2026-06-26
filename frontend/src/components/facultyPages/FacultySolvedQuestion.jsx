/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";
import { useGetFacultyQuestions } from "@/hooks/useGetFacultyQuestions";
import { Navbar } from "../pages/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";

export default function FacultySolvedQuestion() {
  useGetFacultyQuestions(); // Fetch questions
  const questions = useSelector((state) => state.auth.questions);

  // Filter only answered questions
  const solvedQuestions = questions.filter((q) => q.status === "Answered");

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
          <div className="absolute h-full w-full bg-gradient-to-br from-emerald-500/30 to-rose-500/30" />
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
            Solved Questions
          </h1>
          <p className="text-zinc-400 text-lg">View all answered questions</p>
        </motion.div>

        {solvedQuestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <p className="text-zinc-400 text-lg">No solved questions available.</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            {solvedQuestions.map((question) => (
              <motion.div key={question._id} variants={itemVariants}>
                <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all">
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
                          <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <span className="text-emerald-400 font-medium">Answered</span>
                        </div>
                      </div>

                      {/* Question Title */}
                      <div className="pl-10">
                        <p className="text-lg text-zinc-300">{question.questionTitle}</p>
                      </div>

                      {/* ✅ Added Question Text Section */}
                      <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                        <p className="text-zinc-300 leading-relaxed">
                          {question?.questionText || "No question text provided."}
                        </p>
                      </div>

                      {/* Answer */}
                      <div className="pl-10">
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                          <h4 className="text-zinc-300 font-medium mb-2">Answer:</h4>
                          <p className="text-zinc-400">{question.answerText}</p>
                        </div>
                      </div>
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
