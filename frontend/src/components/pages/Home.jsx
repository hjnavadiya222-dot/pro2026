import { Button } from "@/components/ui/button";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "./Navbar";
import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Login } from "../auth/Login";
import { useState } from "react";
import { Signup } from "../auth/Signup";
import {
  MessageCircle,
  GraduationCap,
  Users,
  CheckCircle,
  PenSquare,
  Send,
  Clock,
  CheckSquare
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      title: "24/7 Doubt Resolution",
      description: "Get your questions answered anytime, breaking the limitations of classroom hours"
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      title: "Direct Faculty Connect",
      description: "Connect directly with your college professors without waiting for office hours"
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Expert Guidance",
      description: "Get personalized guidance from experienced faculty members"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      title: "Quality Assured",
      description: "Get verified answers from experienced faculty members you trust"
    }
  ];

  const steps = [
    {
      icon: <PenSquare className="h-8 w-8 text-emerald-400" />,
      title: "Login or Create Account",
      description: "Sign in to your account or create a new one to get started"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-emerald-400" />,
      title: "Click on Ask",
      description: "Navigate to the ask section to submit your question"
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-emerald-400" />,
      title: "Select Subject & Faculty",
      description: "Choose the relevant subject and faculty member for your doubt"
    },
    {
      icon: <Send className="h-8 w-8 text-emerald-400" />,
      title: "Submit Your Doubt",
      description: "Write and submit your question to the selected faculty"
    },
    {
      icon: <Clock className="h-8 w-8 text-emerald-400" />,
      title: "Faculty Response",
      description: "Receive a detailed response from your faculty member"
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-emerald-400" />,
      title: "Doubt Resolved",
      description: "Mark your doubt as resolved once you understand the solution"
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, navigate to faculty directory
      navigate('/faculty');
    } else {
      // If user is not logged in, open login dialog
      setIsLoginOpen(true);
    }
  };

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-zinc-900 to-teal-500/10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-5xl font-bold leading-tight">
                <span className="text-zinc-100">Connect with </span>
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Faculty
                </span>
                <br />
                <span className="text-zinc-100">Get Your Doubts</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Solved Instantly
                </span>
              </h1>

              <p className="text-lg text-zinc-400 leading-relaxed">
                Askverse bridges the gap between students and faculty, making learning more accessible and efficient.
              </p>

              <div className="flex gap-4">
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 rounded-lg text-sm font-medium"
                      onClick={handleGetStarted}
                    >
                      Get Started
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Login isDialog={true} setIsLoginOpen={setIsLoginOpen} />
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>

             {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                  alt="Students collaborating"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="py-20 relative"
      >
        {/* Add decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-emerald-400 font-medium mb-4 block"
            >
              PLATFORM BENEFITS
            </motion.span>
            <h2 className="text-4xl font-bold text-zinc-100 mb-4">Why Choose Askverse?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-6"></div>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Students often struggle to get their doubts resolved outside class hours.
              Askverse bridges this gap by providing a platform where learning never stops.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-100 mb-3">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 bg-zinc-800/30 backdrop-blur-sm" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-emerald-400 font-medium mb-4 block"
            >
              SIMPLE PROCESS
            </motion.span>
            <h2 className="text-4xl font-bold text-zinc-100 mb-4">How It Works</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-6"></div>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Get your doubts resolved in six simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-zinc-800/40 backdrop-blur-sm rounded-xl p-8 border border-zinc-700/50 hover:border-emerald-500/30 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-zinc-100 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 rounded-xl"
                onClick={handleGetStarted}
              >
                Start Asking Questions Now
              </Button>
            </Dialog>
          </motion.div>
        </div>
      </motion.section>

      {/* Added Benefits Section */}
      <div className="mt-20 grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg p-8 border border-zinc-700/50"
        >
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">For Students</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-zinc-400">
              <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
              <span>No more waiting for next day's class to clear doubts</span>
            </li>
            <li className="flex items-center text-zinc-400">
              <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
              <span>Get help with assignments and exam preparation</span>
            </li>
            <li className="flex items-center text-zinc-400">
              <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
              <span>Direct access to faculty expertise anytime</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg p-8 border border-zinc-700/50"
        >
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">For Faculty</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-zinc-400">
              <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
              <span>Efficiently manage student queries in one place</span>
            </li>
            <li className="flex items-center text-zinc-400">
              <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
              <span>Track common doubts and improve teaching methods</span>
            </li>
            <li className="flex items-center text-zinc-400">
              <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
              <span>Build better connections with students</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
