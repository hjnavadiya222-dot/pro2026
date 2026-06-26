import React from "react";
import { motion } from "framer-motion";
import { Github, Mail, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-zinc-900 border-t border-zinc-800">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                            Askverse
                        </h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Connecting students with faculty members for better learning experiences.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-emerald-400 transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-zinc-100">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/about" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/privacy" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="/terms" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-zinc-100">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3 text-zinc-400 group">
                                <Mail className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                                <a
                                    href="mailto:askverseteam@gmail.com"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    askverseteam@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center space-x-3 text-zinc-400">
                                <MapPin className="h-5 w-5 text-emerald-400" />
                                <span>SGPP College, Nashik</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-400"
                >
                    <p>© {new Date().getFullYear()} Askverse. All rights reserved.</p>
                </motion.div>
            </div>
        </footer>
    );
} 