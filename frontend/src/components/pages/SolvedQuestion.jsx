import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useGetAllQuestions } from "@/hooks/useGetAllQuestions";
import { motion } from "framer-motion";
import { Calendar, BookOpen, Tag, Eye } from "lucide-react";

export function SolvedQuestion() {
  useGetAllQuestions();
  const questions = useSelector((state) => state.auth.questions) || [];
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  // Filter only solved questions
  const solvedQuestions = questions.filter((question) => question?.status === "Answered");

  const toggleAnswerView = (questionId) => {
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-zinc-900 to-teal-500/5" />
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
            Solved Questions
          </h1>
          <p className="text-zinc-400 text-lg">Browse through all answered questions from our community</p>
        </motion.div>

        {solvedQuestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mt-8 text-center p-12 bg-zinc-800/30 rounded-xl border border-zinc-700/50 backdrop-blur-sm"
          >
            <div className="text-7xl mb-6">✨</div>
            <h3 className="text-zinc-100 text-2xl font-semibold mb-3">No solved questions yet</h3>
            <p className="text-zinc-400 text-lg">Questions that have been answered will appear here</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto grid gap-6"
          >
            {solvedQuestions.map((question) => (
              <motion.div
                key={question?._id}
                variants={cardVariants}
                whileHover={{ scale: 1.01 }}
                className="transform transition-all duration-300"
              >
                <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-rose-500/10 border-b border-zinc-700/50 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <CardTitle className="text-2xl text-zinc-100">
                        {question?.questionTitle || "Untitled Question"}
                      </CardTitle>
                      <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                        {question?.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Subject and Date */}
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <BookOpen className="h-4 w-4" />
                          <span>{question?.subject || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(question?.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                        <p className="text-zinc-300 leading-relaxed">
                          {question?.questionText || "No question text provided."}
                        </p>
                      </div>

                      {/* Show Answer when expanded */}
                      {expandedQuestionId === question._id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-emerald-500/5 p-6 rounded-xl border border-emerald-500/20">
                            <p className="text-emerald-400 leading-relaxed">
                              {question?.answerText || "No answer available."}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center space-x-2">
                            <span className="text-zinc-400">Answered by:</span>
                            <span className="text-emerald-400">
                              {question?.facultyId?.fullname || "Unknown Faculty"}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Tags and View Details Button */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="h-4 w-4 text-zinc-400" />
                          {question?.tags?.map((tag, idx) => (
                            <Badge
                              key={idx}
                              className="bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => toggleAnswerView(question._id)}
                          className="group border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          {expandedQuestionId === question._id ? 'Hide Details' : 'View Details'}
                        </Button>
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
