import React from "react";
import { Navbar } from "./Navbar";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Target, Users2, ShieldCheck, HelpCircle } from "lucide-react";

export default function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 pb-16">
      <Navbar />

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-zinc-900 to-teal-500/5" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 opacity-20 blur-3xl">
          <div className="absolute h-full w-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30" />
        </div>
      </div>

      <div className="container mx-auto py-16 px-6 max-w-5xl">
        {/* Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            className="text-emerald-400 font-semibold tracking-wider uppercase text-sm block mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            About Our Platform
          </motion.span>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-6">
            Askverse
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-6"></div>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Bridging the communication gap between students and faculty. A dedicated academic Q&A portal designed to streamline doubt resolution outside of standard lecture hours.
          </p>
        </motion.div>

        {/* Info Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Mission */}
          <motion.div variants={itemVariants}>
            <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 h-full">
              <CardContent className="p-8 space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100">Our Mission</h3>
                <p className="text-zinc-400 leading-relaxed">
                  We strive to build a seamless learning ecosystem where student questions are met with verified, high-quality responses from their own professors. Our goal is to make academic guidance accessible anytime, anywhere.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* How It Helps Faculty */}
          <motion.div variants={itemVariants}>
            <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 h-full">
              <CardContent className="p-8 space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
                  <Users2 className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100">For Faculty Members</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Askverse acts as a centralized dashboard to track and respond to student doubts efficiently. Instead of answering the same questions repetitively via different emails, faculty can resolve queries publicly for all students to reference.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 bg-zinc-800/20 border border-zinc-800 backdrop-blur-sm rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-zinc-100 mb-8 text-center">Core Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-zinc-200">Easy Doubt Submission</h4>
              <p className="text-zinc-400 text-sm">Students ask doubts, tag the specific subject, and target relevant faculty members directly.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                <Info className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-zinc-200">Centralized Faculty Board</h4>
              <p className="text-zinc-400 text-sm">Faculty can easily view pending doubts, review attachments, and post descriptive replies.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-zinc-200">Verified & Secure</h4>
              <p className="text-zinc-400 text-sm">Authentication ensures only verified SCET students and faculty can participate on the platform.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
