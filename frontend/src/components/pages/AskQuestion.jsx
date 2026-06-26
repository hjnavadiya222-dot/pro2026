/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";

const AskQuestion = () => {
  const { user } = useSelector((state) => state.auth);
  const studentId = user?._id; // Get student ID from Redux state
  const navigate = useNavigate();

  const [facultyId, setFacultyId] = useState(""); // Store faculty ID
  const [facultyList, setFacultyList] = useState([]); // Store faculty list

  const [formData, setFormData] = useState({
    studentId: "",
    facultyId: "",
    subject: "",
    questionTitle: "",
    questionText: "",
    attachment: null,
  });

  const [subjects, setSubjects] = useState([]); // Store subjects list

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const url = user?.semester 
          ? `http://localhost:8000/api/v1/user/subjects?semester=${user.semester}`
          : `http://localhost:8000/api/v1/user/subjects`;
          
        const response = await axios.get(url, { withCredentials: true });

        if (response.data && Array.isArray(response.data.allSub)) {
          setSubjects(response.data.allSub);
        } else {
          console.error("Subjects data is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching subjects", error);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch faculty when subject is selected
  useEffect(() => {
    if (formData.subject) {
      const fetchFaculty = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/user/faculty?subject=${formData.subject}`,
            { withCredentials: true }
          );
          if (Array.isArray(response.data)) {
            setFacultyList(response.data);
          } else {
            console.error("Faculty data is not an array", response.data);
          }
        } catch (error) {
          console.error("Error fetching faculty", error);
        }
      };
      fetchFaculty();
    } else {
      setFacultyList([]); // Clear faculty list when no subject is selected
    }
  }, [formData.subject]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        attachment: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle faculty selection
  const handleFacultyChange = (e) => {
    const selectedFacultyId = e.target.value;
    setFacultyId(selectedFacultyId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !studentId ||
      !facultyId ||
      !formData.subject ||
      !formData.questionTitle ||
      !formData.questionText
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const submitData = new FormData();
    submitData.append("studentId", studentId); // Ensure studentId is included
    submitData.append("facultyId", facultyId); // Ensure facultyId is included
    submitData.append("subject", formData.subject);
    submitData.append("questionTitle", formData.questionTitle);
    submitData.append("questionText", formData.questionText);

    if (formData.attachment) {
      submitData.append("questionFile", formData.attachment); // Make sure this matches backend key
    }

    try {
      await axios.post(
        "http://localhost:8000/api/v1/question/ask",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setFormData({
        subject: "",
        questionTitle: "",
        questionText: "",
        attachment: null,
      });
      setFacultyId(""); // Reset faculty selection
      navigate("/");
    } catch (error) {
      console.error(
        "Error adding question",
        error.response?.data || error.message
      );
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
            Ask a Question
          </h1>
          <p className="text-zinc-400 text-lg">Get help from our expert faculty members</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              {/* Subject Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Select Subject</label>
                <select
                  className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="" className="bg-zinc-800">Choose a subject</option>
                  {subjects.length > 0 ? (
                    subjects.map((subject, index) => (
                      <option key={index} value={subject} className="bg-zinc-800">
                        {subject}
                      </option>
                    ))
                  ) : (
                    <option disabled className="bg-zinc-800">No subjects available</option>
                  )}
                </select>
              </div>

              {/* Faculty Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Select Faculty</label>
                <select
                  className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  name="faculty"
                  value={facultyId}
                  onChange={handleFacultyChange}
                >
                  <option value="" className="bg-zinc-800">Choose a faculty member</option>
                  {facultyList.length > 0 ? (
                    facultyList.map((fac) => (
                      <option key={fac._id} value={fac._id} className="bg-zinc-800">
                        {fac.fullname}
                      </option>
                    ))
                  ) : (
                    <option disabled className="bg-zinc-800">No faculty available</option>
                  )}
                </select>
              </div>

              {/* Question Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Question Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  name="questionTitle"
                  value={formData.questionTitle}
                  onChange={handleChange}
                  placeholder="Enter a clear and concise title"
                />
              </div>

              {/* Question Text Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Question Details</label>
                <textarea
                  className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  name="questionText"
                  rows="6"
                  value={formData.questionText}
                  onChange={handleChange}
                  placeholder="Describe your question in detail..."
                ></textarea>
              </div>

              {/* File Attachment */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Attach File (Optional)</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    className="block w-full text-sm text-zinc-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-emerald-500/10 file:text-emerald-400
                      hover:file:bg-emerald-500/20"
                    name="attachment"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                  onClick={handleSubmit}
                >
                  Submit Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AskQuestion;
