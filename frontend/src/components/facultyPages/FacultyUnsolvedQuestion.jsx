/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetFacultyQuestions } from "@/hooks/useGetFacultyQuestions";
import { Navbar } from "../pages/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageCircle, Clock, X, Search, User, Mail, GraduationCap } from "lucide-react";

export default function FacultyUnsolvedQuestion() {
  useGetFacultyQuestions(); // Fetch questions
  const questions = useSelector((state) => state.auth.questions) || [];
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // State to manage answers
  const [answers, setAnswers] = useState({});

  // State to handle image modal
  const [selectedImage, setSelectedImage] = useState(null);

  // Filter only pending (unsolved) questions
  const unsolvedQuestions = questions.filter((q) => q.status === "Pending");

  // Filter based on search query
  const filteredQuestions = unsolvedQuestions.filter((q) => {
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

  // Handle input change
  const handleInputChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Handle answer submission
  const handleAnswerSubmit = async (id) => {
    if (!answers[id] || !answers[id].trim()) {
      return alert("Please enter an answer reply first.");
    }
    try {
      await axios.post(
        `http://localhost:8000/api/v1/question/answer/${id}`,
        {
          answerText: answers[id],
        },
        { withCredentials: true }
      );

      navigate("/faculty/solved/questions");
    } catch (error) {
      console.error(
        "Error submitting answer:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Handle quick mark as solved
  const handleQuickSolve = async (id) => {
    try {
      await axios.post(
        `http://localhost:8000/api/v1/question/answer/${id}`,
        {
          answerText: "Doubt resolved by faculty.",
        },
        { withCredentials: true }
      );

      navigate("/faculty/solved/questions");
    } catch (error) {
      console.error(
        "Error marking as solved:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <div className="container mx-auto py-12 px-6">
        <motion.div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-rose-400 mb-3">
            Unsolved Questions
          </h1>
          <p className="text-zinc-400 text-lg">Answer pending questions</p>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-rose-500 mx-auto mt-4"></div>
        </motion.div>

        {/* Search Bar */}
        {unsolvedQuestions.length > 0 && (
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

        {unsolvedQuestions.length === 0 ? (
          <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm text-center p-8 max-w-2xl mx-auto">
            <p className="text-zinc-400 text-lg">No unsolved questions available.</p>
          </Card>
        ) : filteredQuestions.length === 0 ? (
          <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm text-center p-8 max-w-2xl mx-auto">
            <p className="text-zinc-400 text-lg">No unsolved questions match your search.</p>
          </Card>
        ) : (
          <motion.div className="grid gap-6 max-w-4xl mx-auto">
            {filteredQuestions.map((question) => (
              <Card
                key={question._id}
                className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm shadow-md"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-emerald-400" />{" "}
                        {question.subject}
                      </h3>
                      <span className="text-rose-400 font-medium flex items-center gap-2 text-sm bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                        <Clock className="h-4 w-4" /> Pending
                      </span>
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

                    <p className="text-lg text-zinc-100 font-medium pl-1">
                      {question.questionTitle}
                    </p>

                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                      <p className="text-zinc-300 leading-relaxed">
                        {question?.questionText || "No question text provided."}
                      </p>
                    </div>

                    {question?.questionFile?.url && (
                      <div className="pl-1">
                        <img
                          src={question.questionFile.url}
                          alt="Question Attachment"
                          className="w-full max-h-80 object-contain rounded-lg border border-zinc-700 shadow-md mb-2"
                        />
                        <Button
                          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-xl text-sm"
                          onClick={() =>
                            setSelectedImage(question.questionFile.url)
                          }
                        >
                          View Full Image
                        </Button>
                      </div>
                    )}

                    <textarea
                      className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-zinc-500"
                      placeholder="Enter your answer here..."
                      value={answers[question._id] || ""}
                      onChange={(e) =>
                        handleInputChange(question._id, e.target.value)
                      }
                      rows="4"
                    ></textarea>

                    <div className="flex gap-4">
                      <Button
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 font-semibold shadow-md shadow-emerald-500/10 transition-all duration-200 rounded-xl px-6"
                        onClick={() => handleAnswerSubmit(question._id)}
                      >
                        Submit Answer
                      </Button>
                      <Button
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-all duration-200 rounded-xl px-6"
                        onClick={() => handleQuickSolve(question._id)}
                      >
                        Mark as Solved
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="relative p-4 max-w-4xl w-full">
            <button
              className="absolute -top-12 right-2 bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full shadow-lg"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Full Size"
              className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
