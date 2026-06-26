import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "../pages/Navbar";
import { UserPlus, UserMinus, Mail, Building, BookOpen, X } from "lucide-react";
import { useSelector } from "react-redux";

const API_BASE_URL = 'http://localhost:8000/api/v1/user';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

// Add request interceptor to include token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Default subjects list
const DEFAULT_SUBJECTS = [
    "Principles of Economics and Management (BTAS10301)",
    "Computer Organization and Architecture (BTCO13302)",
    "Microprocessor and Interfacing (BTCO13303)",
    "Object Oriented Programming (BTCO13304)",
    "Discrete Mathematics (BTIT13301)",
    "Data Structures (BTIT13302)",
    "Essence of Indian Traditional Knowledge (BTMD17301)",
    "Entrepreneurship and Start-up (BTAS10401)",
    "Probability and Statistics (BTAS11402)",
    "Computer Networks (BTCO13401)",
    "Operating Systems (BTCO13402)",
    "Design and Analysis of Algorithms (BTCO13403)",
    "Database Management Systems (BTCO13404)",
    "Engineering Optimization (BTAS10501)",
    "Web Technologies (BTCO13502)",
    "Data Mining and Business Intelligence (BTIT13501)",
    "Cryptography and Network Security (BTIT13502)",
    "Software Engineering (BTIT14501)",
    "Cloud Computing (BTIT14502)",
    "Cyber Physical Systems (BTIT14503)",
    "Information and Communication Technology in Agriculture (BTIT14504)",
    "Data Science using Python (BTIT15501)",
    "Programming with Java (BTIT15502)",
    "Data Analysis and Visualization (BTIT13601)",
    "Artificial Intelligence and Applications (BTIT13602)",
    "E-Commerce and E-Business Management (BTIT13603)",
    "Computer Graphics (BTIT14601)",
    "Mobile Application Development (BTIT14602)",
    "Advanced Web Technology (BTIT14603)",
    "NoSQL Databases (BTIT14604)",
    "Computer Vision (BTIT14605)",
    "DotNet Technology (BTIT14606)",
    "Machine Learning Techniques (BTIT14607)",
    "Data Compression (BTIT14608)",
    "Introduction to Artificial Intelligence (BTIT15601)",
    "Information Security (BTIT15602)",
    "Research & Innovation (BTMD17608)",
    "Automata Theory and Compiler Design (BTIT13701)",
    "Distributed Systems (BTIT13702)",
    "Agile Development and UX Design (BTIT14701)",
    "Blockchain Technology and Applications (BTIT14702)",
    "Software Testing (BTIT14703)",
    "IOT and Applications (BTIT14704)",
    "Wireless Communications (BTIT14705)",
    "Natural Language Processing (BTIT14706)",
    "Secure Software Engineering (BTIT14707)",
    "Advanced Database Systems (BTIT14708)",
    "Fundamentals of Blockchain Technology (BTIT15701)",
    "Introduction to Machine Learning (BTIT15702)",
    "Project-I (BTIT16701)",
    "Indian Constitution (BTMD17701)",
    "Project-II/ Internship (BTIT16801)",
    "Business Ethics and Corporate Responsibilities (BTMD17801)"
];

const AdminHome = () => {
    const [facultyList, setFacultyList] = useState([]);
    const [newFaculty, setNewFaculty] = useState({
        fullname: '',
        email: '',
        department: '',
        subject: [],
        phoneNumber: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Get admin name from Redux store
    const adminName = useSelector((state) => state.auth.user?.fullname);

    useEffect(() => {
        fetchFaculty();
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await api.get("/subjects");
            if (Array.isArray(response.data)) {
                setSubjects(response.data);
            } else {
                console.warn('Subjects API did not return an array, using default subjects');
                setSubjects(DEFAULT_SUBJECTS);
            }
        } catch (err) {
            console.error('Error fetching subjects:', err);
            toast.error('Failed to fetch subjects, using default list');
        }
    };

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const response = await api.get("/faculty/all");
            setFacultyList(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching faculty:', err);
            setError('Failed to fetch faculty list');
            if (err.response?.status === 401) {
                toast.error('Please login again');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFaculty(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubjectChange = (e) => {
        const selectedSubjects = Array.from(e.target.selectedOptions, option => option.value);
        setNewFaculty(prev => ({
            ...prev,
            subject: selectedSubjects
        }));
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();

        if (newFaculty.subject.length === 0) {
            toast.error('Please select at least one subject');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/add-faculty", newFaculty);
            setFacultyList([...facultyList, response.data]);
            setNewFaculty({
                fullname: '',
                email: '',
                department: '',
                subject: [],
                phoneNumber: '',
                password: ''
            });
            setIsFormOpen(false);
            setSuccess('Faculty added successfully');
            setError('');
            toast.success('Faculty added successfully');
        } catch (err) {
            console.error('Error adding faculty:', err);
            setError(err.response?.data?.message || 'Failed to add faculty');
            setSuccess('');
            if (err.response?.status === 401) {
                toast.error('Please login again');
            } else {
                toast.error(err.response?.data?.message || 'Failed to add faculty');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFaculty = async (id) => {
        if (!window.confirm('Are you sure you want to remove this faculty member?')) {
            return;
        }

        try {
            setLoading(true);
            await api.delete(`/delete-faculty/${id}`);
            setFacultyList(facultyList.filter(faculty => faculty._id !== id));
            setSuccess('Faculty removed successfully');
            setError('');
            toast.success('Faculty removed successfully');
        } catch (err) {
            console.error('Error removing faculty:', err);
            const errorMessage = err.response?.data?.message || 'Failed to remove faculty';
            setError(errorMessage);
            setSuccess('');
            if (err.response?.status === 401) {
                toast.error('Please login again');
            } else if (err.response?.status === 404) {
                toast.error('Faculty member not found');
            } else if (err.response?.status === 403) {
                toast.error('You do not have permission to remove faculty');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

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
                    className="space-y-4 mb-12"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-semibold text-zinc-100">
                            Hey, Welcome {adminName || 'Admin'}!
                        </h2>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-rose-400 mb-3">
                                Faculty Management
                            </h1>
                            <p className="text-zinc-400 text-lg">Manage faculty members and their subjects</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-2 rounded-lg transition-colors"
                        >
                            <UserPlus className="h-5 w-5" />
                            Add New Faculty
                        </motion.button>
                    </div>
                </motion.div>

                {/* Add Faculty Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-800/90 rounded-xl shadow-xl max-w-2xl w-full p-6 border border-zinc-700/50"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-zinc-100">Add New Faculty</h2>
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="text-zinc-400 hover:text-zinc-200 transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <form onSubmit={handleAddFaculty} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { name: 'fullname', label: 'Full Name', type: 'text', icon: UserPlus },
                                        { name: 'email', label: 'Email', type: 'email', icon: Mail },
                                        { name: 'department', label: 'Department', type: 'text', icon: Building },
                                        { name: 'phoneNumber', label: 'Phone Number', type: 'text', icon: UserPlus },
                                        { name: 'password', label: 'Password', type: 'password', icon: UserPlus }
                                    ].map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400">{field.label}</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <field.icon className="h-5 w-5 text-zinc-500" />
                                                </div>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={newFaculty[field.name]}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Subjects</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <BookOpen className="h-5 w-5 text-zinc-500" />
                                            </div>
                                            <select
                                                multiple
                                                name="subject"
                                                value={newFaculty.subject}
                                                onChange={handleSubjectChange}
                                                className="w-full pl-10 pr-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-32"
                                                required
                                            >
                                                {subjects && subjects.map((subject, index) => (
                                                    <option key={index} value={subject} className="bg-zinc-800 text-zinc-100">
                                                        {subject}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="text-sm text-zinc-500">
                                            Hold Ctrl/Cmd to select multiple subjects. At least one subject is required.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-4 py-2 border border-zinc-600 rounded-lg text-zinc-400 hover:bg-zinc-700/50 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Adding...' : 'Add Faculty'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Messages */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-rose-500/20 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-lg"
                    >
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg"
                    >
                        {success}
                    </motion.div>
                )}

                {/* Faculty List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-6"
                    >
                        {facultyList.map((faculty) => (
                            <motion.div key={faculty._id} variants={itemVariants}>
                                <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-all">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {/* Faculty Info */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                                                        <UserPlus className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-zinc-100">{faculty.fullname}</h3>
                                                        <p className="text-zinc-400">{faculty.email}</p>
                                                    </div>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleRemoveFaculty(faculty._id)}
                                                    className="p-2 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                                >
                                                    <UserMinus className="h-5 w-5" />
                                                </motion.button>
                                            </div>

                                            {/* Department */}
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                                                    <Building className="h-5 w-5" />
                                                </div>
                                                <p className="text-zinc-400">{faculty.department}</p>
                                            </div>

                                            {/* Subjects */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-zinc-400">Subjects</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2 pl-10">
                                                    {Array.isArray(faculty.subject) ? faculty.subject.map((sub, index) => (
                                                        <Badge key={index} className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                                                            {sub}
                                                        </Badge>
                                                    )) : (
                                                        <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                                                            {faculty.subject}
                                                        </Badge>
                                                    )}
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
};

export default AdminHome;