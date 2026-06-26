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
import { MessageCircle, Clock, X } from "lucide-react";

export default function FacultyUnsolvedQuestion() {
  useGetFacultyQuestions(); // Fetch questions
  const questions = useSelector((state) => state.auth.questions);
  const navigate = useNavigate();

  // State to manage answers
  const [answers, setAnswers] = useState({});

  // State to handle image modal
  const [selectedImage, setSelectedImage] = useState(null);

  // Filter only pending (unsolved) questions
  const unsolvedQuestions = questions.filter((q) => q.status === "Pending");

  // Handle input change
  const handleInputChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Handle answer submission
  const handleAnswerSubmit = async (id) => {
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

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <div className="container mx-auto py-12 px-6">
        <motion.div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-rose-400 mb-3">
            Unsolved Questions
          </h1>
          <p className="text-zinc-400 text-lg">Answer pending questions</p>
        </motion.div>

        {unsolvedQuestions.length === 0 ? (
          <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm text-center p-8">
            <p className="text-zinc-400 text-lg">No unsolved questions available.</p>
          </Card>
        ) : (
          <motion.div className="grid gap-6">
            {unsolvedQuestions.map((question) => (
              <Card
                key={question._id}
                className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-emerald-400" />{" "}
                        {question.subject}
                      </h3>
                      <span className="text-rose-400 font-medium flex items-center gap-2">
                        <Clock className="h-5 w-5" /> Pending
                      </span>
                    </div>

                    <p className="text-lg text-zinc-300 pl-10">
                      {question.questionTitle}
                    </p>

                    {/* ✅ Added questionText section here */}
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                      <p className="text-zinc-300 leading-relaxed">
                        {question?.questionText || "No question text provided."}
                      </p>
                    </div>

                    {question?.questionFile?.url && (
                      <div className="pl-10">
                        <img
                          src={question.questionFile.url}
                          alt="Question Attachment"
                          className="w-full max-h-80 object-contain rounded-lg border border-zinc-600 shadow-md"
                        />
                        <Button
                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                          onClick={() =>
                            setSelectedImage(question.questionFile.url)
                          }
                        >
                          See Image
                        </Button>
                      </div>
                    )}

                    <textarea
                      className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your answer here..."
                      value={answers[question._id] || ""}
                      onChange={(e) =>
                        handleInputChange(question._id, e.target.value)
                      }
                      rows="4"
                    ></textarea>

                    <Button
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                      onClick={() => handleAnswerSubmit(question._id)}
                    >
                      Submit Answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative bg-zinc-900 p-4 rounded-lg shadow-lg max-w-2xl w-full">
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Full Size"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
