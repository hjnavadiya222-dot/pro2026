import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Mail, 
  Award, 
  BookOpen, 
  Briefcase, 
  Layers, 
  MessageSquare, 
  Filter, 
  ArrowUpDown,
  GraduationCap
} from "lucide-react";

export default function FacultyDirectory() {
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("All Faculty");
  const [sortBy, setSortBy] = useState("alphabetical");

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/user/faculty/all", {
          withCredentials: true,
        });
        if (Array.isArray(response.data)) {
          setFacultyList(response.data);
        } else {
          setError("Failed to parse faculty directory.");
        }
      } catch (err) {
        console.error("Error fetching faculty directory:", err);
        setError("Error loading faculty directory. Please make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  // Helper to parse experience string to numeric value for sorting
  const parseExperienceYears = (expStr) => {
    if (!expStr || expStr.toLowerCase() === "nil" || expStr.toLowerCase() === "none") {
      return 0;
    }
    const matches = expStr.match(/(\d+(\.\d+)?)/g);
    if (!matches) return 0;
    // Sum up all parsed numbers to handle cases like "22 Years (Academic), 1.5 Years (Industry)"
    return matches.reduce((sum, val) => sum + parseFloat(val), 0);
  };

  // Filter & Search Logic
  const filteredFaculty = facultyList.filter((fac) => {
    const query = searchQuery.toLowerCase().trim();
    const nameMatch = fac.fullname?.toLowerCase().includes(query);
    const qualMatch = fac.qualification?.toLowerCase().includes(query);
    const desMatch = fac.designation?.toLowerCase().includes(query);
    const searchMatch = nameMatch || qualMatch || desMatch;

    if (designationFilter === "All Faculty") {
      return searchMatch;
    }

    // Substring / Exact matching for designation filters
    const des = fac.designation || "";
    if (designationFilter === "Professor") {
      // Exclude Associate / Assistant
      return searchMatch && des === "Professor";
    } else if (designationFilter === "Associate Professor") {
      return searchMatch && des === "Associate Professor";
    } else if (designationFilter === "Assistant Professor") {
      return searchMatch && des.startsWith("Assistant Professor");
    }

    return searchMatch;
  });

  // Sorting Logic
  const sortedFaculty = [...filteredFaculty].sort((a, b) => {
    if (sortBy === "alphabetical") {
      return (a.fullname || "").localeCompare(b.fullname || "");
    } else if (sortBy === "experience") {
      const expA = parseExperienceYears(a.experience);
      const expB = parseExperienceYears(b.experience);
      return expB - expA; // Highest First
    }
    return 0;
  });

  const handleAskDoubt = (fac) => {
    const defaultSub = fac.subject?.[0] || "Data Structures (BTIT13302)";
    navigate("/askquestion", {
      state: {
        preselectedFaculty: {
          _id: fac._id,
          fullname: fac.fullname,
          email: fac.email,
          subject: defaultSub
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
      <Navbar />

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-zinc-900 to-teal-500/5" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 opacity-20 blur-3xl">
          <div className="absolute h-full w-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30" />
        </div>
      </div>

      <div className="container mx-auto py-12 px-6 flex-grow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-3 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10 text-emerald-400" />
            Faculty Directory
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Browse through our expert faculty members, assistants, and attendants. Connect directly to clear your doubts.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-4"></div>
        </motion.div>

        {/* Controls: Search, Filter, Sort */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-6 mb-8 backdrop-blur-sm shadow-lg space-y-4 md:space-y-0 md:flex md:items-center md:gap-4"
        >
          {/* Search Box */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, qualification, designation..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="h-5 w-5 text-zinc-400" />
            <select
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition duration-200"
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
            >
              <option value="All Faculty" className="bg-zinc-900">All Faculty</option>
              <option value="Professor" className="bg-zinc-900">Professor</option>
              <option value="Associate Professor" className="bg-zinc-900">Associate Professor</option>
              <option value="Assistant Professor" className="bg-zinc-900">Assistant Professor</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <ArrowUpDown className="h-5 w-5 text-zinc-400" />
            <select
              className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition duration-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="alphabetical" className="bg-zinc-900">Alphabetical (A-Z)</option>
              <option value="experience" className="bg-zinc-900">Experience (Highest First)</option>
            </select>
          </div>
        </motion.div>

        {/* Directory Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-zinc-400">Loading faculty members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-zinc-800/20 border border-zinc-700/50 rounded-2xl">
            <p className="text-rose-400 font-medium">{error}</p>
            <p className="text-zinc-500 mt-2">Log in to view the directory and connect with faculty members.</p>
          </div>
        ) : sortedFaculty.length === 0 ? (
          <div className="text-center py-16 bg-zinc-800/20 border border-zinc-700/50 rounded-2xl">
            <p className="text-zinc-400 text-lg">No faculty members found matching your search criteria.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {sortedFaculty.map((fac, index) => {
                const displayEmail = (!fac.email || fac.email === "-") ? "Not Available" : fac.email;
                const showMailto = displayEmail !== "Not Available";

                return (
                  <motion.div
                    key={fac._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                    className="group"
                  >
                    <Card className="h-full bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1">
                      <CardContent className="p-6 flex flex-col h-full justify-between space-y-6">
                        
                        {/* Upper Section */}
                        <div className="space-y-4">
                          {/* Photo and Name Header */}
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={fac.profile?.profilePicture?.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwcRgFA-KFW6u0wScyvZEBWMLME5WkdeCUg&s"}
                                alt={fac.fullname}
                                className="w-16 h-16 rounded-full border-2 border-emerald-500/20 object-cover group-hover:border-emerald-400 transition-colors duration-300"
                              />
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-zinc-900">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors duration-300 line-clamp-1">
                                {fac.fullname}
                              </h3>
                              <p className="text-sm text-emerald-500 font-medium">
                                {fac.designation}
                              </p>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="h-px bg-zinc-800" />

                          {/* Details List */}
                          <div className="space-y-2.5 text-sm text-zinc-300">
                            {/* Qualification */}
                            <div className="flex items-start space-x-2">
                              <Award className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                              <div>
                                <span className="text-zinc-500 font-medium">Qualification: </span>
                                {fac.qualification || "N/A"}
                              </div>
                            </div>

                            {/* Experience */}
                            <div className="flex items-start space-x-2">
                              <Briefcase className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                              <div>
                                <span className="text-zinc-500 font-medium">Experience: </span>
                                {fac.experience || "N/A"}
                              </div>
                            </div>

                            {/* Portfolio */}
                            {fac.portfolio && (
                              <div className="flex items-start space-x-2">
                                <Layers className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                                <div>
                                  <span className="text-zinc-500 font-medium">Portfolio: </span>
                                  {fac.portfolio}
                                </div>
                              </div>
                            )}

                            {/* Email */}
                            <div className="flex items-start space-x-2">
                              <Mail className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                              <div>
                                <span className="text-zinc-500 font-medium">Email: </span>
                                {showMailto ? (
                                  <a 
                                    href={`mailto:${displayEmail}`}
                                    className="text-emerald-400 hover:text-emerald-300 hover:underline transition duration-150"
                                  >
                                    {displayEmail}
                                  </a>
                                ) : (
                                  <span className="text-zinc-400 italic">{displayEmail}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lower Section (Actions) */}
                        <div className="pt-2">
                          <Button
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/10 transition-all duration-300 rounded-xl py-2 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                            onClick={() => handleAskDoubt(fac)}
                          >
                            <MessageSquare className="h-4 w-4" />
                            Ask Doubt
                          </Button>
                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
