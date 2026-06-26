/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useGetFacultyQuestions } from "@/hooks/useGetFacultyQuestions";
import { MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { Navbar } from "./Navbar";

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function FacultyHome() {
    useGetFacultyQuestions();

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const questions = useSelector((state) => state.auth.questions);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (user?.role !== "Faculty") {
            navigate("/");
        }
    }, [user, navigate]);

    // Calculate statistics
    const totalQuestions = questions?.length || 0;
    const answeredQuestions = questions?.filter(q => q.status === "Answered")?.length || 0;
    const pendingQuestions = questions?.filter(q => q.status === "Pending")?.length || 0;

    return (
        <div className="min-h-screen bg-zinc-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-zinc-100 mb-2">
                        Welcome, {user?.fullname}!
                    </h1>
                    <p className="text-zinc-400">
                        Here's an overview of your questions and answers.
                    </p>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div variants={cardVariants} initial="hidden" animate="visible">
                        <Card
                            className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all cursor-pointer"
                            onClick={() => navigate("/faculty/allquestions")}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-zinc-100">All Questions</h3>
                                        <p className="text-zinc-400">View all questions</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                        <Card
                            className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all cursor-pointer"
                            onClick={() => navigate("/faculty/solved/questions")}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-zinc-100">Answered Questions</h3>
                                        <p className="text-zinc-400">View answered questions</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                        <Card
                            className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all cursor-pointer"
                            onClick={() => navigate("/faculty/unsolved/questions")}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-amber-500/10 text-amber-400">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-zinc-100">Pending Questions</h3>
                                        <p className="text-zinc-400">View pending questions</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-zinc-400">Total Questions</p>
                                        <h3 className="text-2xl font-bold text-zinc-100">{totalQuestions}</h3>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-zinc-400">Answered</p>
                                        <h3 className="text-2xl font-bold text-zinc-100">{answeredQuestions}</h3>
                                    </div>
                                    <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-zinc-400">Pending</p>
                                        <h3 className="text-2xl font-bold text-zinc-100">{pendingQuestions}</h3>
                                    </div>
                                    <div className="p-3 rounded-full bg-amber-500/10 text-amber-400">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 