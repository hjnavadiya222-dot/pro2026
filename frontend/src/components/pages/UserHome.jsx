/* eslint-disable no-unused-vars */
import React from "react";
import { Navbar } from "./Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useGetAllQuestions } from "@/hooks/useGetAllQuestions";
import { motion } from "framer-motion";
import {
    BookOpen,
    CheckCircle2,
    Clock,
    Plus,
    MessageCircle,
    TrendingUp,
    Users,
    BookMarked
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FacultyHome } from "./FacultyHome";
import { useGetFacultyQuestions } from "@/hooks/useGetFacultyQuestions";

export function UserHome() {
    useGetAllQuestions();
    const navigate = useNavigate();
    const questions = useSelector((state) => state.auth.questions) || [];
    const user = useSelector((state) => state.auth.user);

    if(user?.role === "Faculty" ){
        navigate("/faculty/homepage");
        return 
    }
    if(user?.role === "Admin" ){
        navigate("/admin/homepage");
        return 
    }

    // Calculate statistics
    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter(q => q.status === "Answered").length;
    const pendingQuestions = questions.filter(q => q.status === "Pending").length;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
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
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-rose-400 mb-3">
                        Welcome back, {user?.fullname || "User"}!
                    </h1>
                    <p className="text-zinc-400 text-lg">Your academic Q&A dashboard</p>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all cursor-pointer"
                            onClick={() => navigate("/askquestion")}>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-zinc-100 font-semibold">Ask Question</h3>
                                    <p className="text-zinc-400 text-sm">Post a new question</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all cursor-pointer"
                            onClick={() => navigate("/allquestions")}>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                    <MessageCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-zinc-100 font-semibold">All Questions</h3>
                                    <p className="text-zinc-400 text-sm">Browse all questions</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all cursor-pointer"
                            onClick={() => navigate("/solvedquestions")}>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-zinc-100 font-semibold">Solved</h3>
                                    <p className="text-zinc-400 text-sm">View answered questions</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all cursor-pointer"
                            onClick={() => navigate("/unsolvedquestions")}>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-full bg-rose-500/10 text-rose-400">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-zinc-100 font-semibold">Pending</h3>
                                    <p className="text-zinc-400 text-sm">Track pending questions</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Statistics */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                        <BookMarked className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 text-sm">Total Questions</p>
                                        <h3 className="text-2xl font-bold text-zinc-100">{totalQuestions}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 text-sm">Answered</p>
                                        <h3 className="text-2xl font-bold text-zinc-100">{answeredQuestions}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-rose-500/10 text-rose-400">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 text-sm">Pending</p>
                                        <h3 className="text-2xl font-bold text-zinc-100">{pendingQuestions}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
} 