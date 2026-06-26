import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useGetAllQuestions } from "@/hooks/useGetAllQuestions";
import { motion } from "framer-motion";
import { Calendar, BookOpen, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define status colors with new theme
const statusColors = {
    Answered: "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30",
    Pending: "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30",
};

export function UnSolvedQuestions() {
    useGetAllQuestions();
    let questions = useSelector((state) => state.auth.questions) || [];

    questions = questions.filter((question) => question.status === "Pending");

    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

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
                        All Questions
                    </h1>
                    <p className="text-zinc-400 text-lg">Browse all questions from the community</p>
                </motion.div>

                {questions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto mt-8 text-center p-12 bg-zinc-800/30 rounded-xl border border-zinc-700/50 backdrop-blur-sm"
                    >
                        <div className="text-7xl mb-6">✨</div>
                        <h3 className="text-zinc-100 text-2xl font-semibold mb-3">No questions yet</h3>
                        <p className="text-zinc-400 text-lg">Be the first to ask a question!</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl mx-auto grid gap-6"
                    >
                        {questions.map((question) => (
                            <motion.div
                                key={question?._id}
                                variants={cardVariants}
                                whileHover={{ scale: 1.01 }}
                                className="transform transition-all duration-300"
                            >
                                <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm shadow-xl overflow-hidden relative">
                                    <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-rose-500/10 border-b border-zinc-700/50 p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <CardTitle className="text-2xl text-zinc-100">
                                                {question?.questionTitle || "Untitled Question"}
                                            </CardTitle>
                                            <Badge className={`${statusColors[question?.status]} text-sm px-4 py-1`}>
                                                {question?.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6 relative">
                                        <div className="space-y-6">
                                            {/* Subject, Date, and Asked By */}
                                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <BookOpen className="h-4 w-4" />
                                                    <span>{question?.subject || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(question?.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Tag className="h-4 w-4" />
                                                    <span>Asked to: {question?.facultyId?.fullname || "Unknown"}</span>
                                                </div>
                                            </div>

                                            {/* Question Text */}
                                            <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                                                <p className="text-zinc-300 leading-relaxed">
                                                    {question?.questionText || "No question text provided."}
                                                </p>
                                            </div>
                                        </div>
                                        {user?.role === "Faculty" && (
                                            <Button
                                                variant="outline"
                                                className="absolute left-6 bottom-6 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-300"
                                                onClick={() => navigate(`/answer/${question._id}`)}
                                            >
                                                Answer
                                            </Button>
                                        )}
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
