import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function EditProfile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    phoneNumber: user?.phoneNumber || "",
    department: user?.department || "",
    semester: user?.semester || "",
    designation: user?.designation || "Assistant Professor",
    qualification: user?.qualification || "",
    experience: user?.experience || "",
    portfolio: user?.portfolio || "",
  });

  const [selectedSubjects, setSelectedSubjects] = useState(user?.subject || []);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user?.profile?.profilePicture?.url || "");

  // Fetch all subjects for faculty to select from
  useEffect(() => {
    if (user?.role === "Faculty") {
      const fetchSubjects = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/v1/user/subjects", {
            withCredentials: true,
          });
          if (response.data?.success && Array.isArray(response.data?.allSub)) {
            setAllSubjects(response.data.allSub);
          }
        } catch (error) {
          console.error("Failed to fetch subjects:", error);
        }
      };
      fetchSubjects();
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile picture change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle subject addition and removal
  const handleAddSubject = (subject) => {
    if (subject && !selectedSubjects.includes(subject)) {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setSelectedSubjects(selectedSubjects.filter((sub) => sub !== subjectToRemove));
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (user.role === "Faculty" && selectedSubjects.length === 0) {
      toast.error("Please select at least one subject.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("department", formData.department);
      
      if (user.role === "Student") {
        formDataToSend.append("semester", formData.semester);
      }
      
      if (user.role === "Faculty") {
        formDataToSend.append("designation", formData.designation);
        formDataToSend.append("qualification", formData.qualification);
        formDataToSend.append("experience", formData.experience);
        formDataToSend.append("portfolio", formData.portfolio);
        formDataToSend.append("subject", JSON.stringify(selectedSubjects));
      }

      if (profilePicture) {
        formDataToSend.append("profilePicture", profilePicture);
      }

      const { data } = await axios.post(
        `http://localhost:8000/api/v1/user/profile/${user?._id}`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(setUser(data.user));
      navigate("/profile");
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Enhanced Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-zinc-900 to-teal-500/5" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 opacity-20 blur-3xl">
          <div className="absolute h-full w-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30" />
        </div>
      </div>

      <div className="container mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-3xl mx-auto bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center border-b border-zinc-700/50 pb-8">
              <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                Edit Your Profile
              </CardTitle>
              <p className="text-zinc-400 mt-2">Update your personal information and profile picture</p>
            </CardHeader>

            <CardContent className="p-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-10">
                <label htmlFor="profilePicture" className="cursor-pointer group relative">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-emerald-500/20 transition-all duration-300 group-hover:border-emerald-500/40 shadow-xl">
                      <AvatarImage src={preview} alt="Profile Picture" className="object-cover" />
                      <AvatarFallback className="bg-emerald-500/10 text-emerald-500 text-3xl">
                        {user?.fullname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm">Change Photo</span>
                    </div>
                  </div>
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              {/* Profile Form with Grid Layout */}
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium">Full Name</Label>
                    <Input
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-11"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium">Phone Number</Label>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-11"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium">Department</Label>
                    <Input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-11"
                      placeholder="Enter department"
                    />
                  </div>

                  {user.role === "Student" && (
                    <div className="space-y-2">
                      <Label className="text-zinc-300 font-medium">Semester</Label>
                      <Input
                        name="semester"
                        type="number"
                        value={formData.semester}
                        onChange={handleChange}
                        required
                        min={3}
                        max={8}
                        className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-11"
                        placeholder="Enter semester (3-8)"
                      />
                    </div>
                  )}

                  {user.role === "Faculty" && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-zinc-300 font-medium">Designation</Label>
                        <select
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          required
                          className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-100 h-11 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <option value="Professor">Professor</option>
                          <option value="Associate Professor">Associate Professor</option>
                          <option value="Assistant Professor">Assistant Professor</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-zinc-300 font-medium">Qualification</Label>
                        <Input
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                          className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-11"
                          placeholder="e.g. M.Tech, Ph.D."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-zinc-300 font-medium">Experience</Label>
                        <Input
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-11"
                          placeholder="e.g. 5 Years"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-zinc-300 font-medium">Portfolio</Label>
                        <Input
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleChange}
                          className="bg-zinc-800/50 border-zinc-700 text-zinc-100 h-11"
                          placeholder="e.g. Head of Department, Convener"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-4 pt-4 border-t border-zinc-700/50">
                        <Label className="text-zinc-300 font-medium block">Subjects Taught</Label>
                        
                        {/* Selected subjects badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedSubjects.map((sub, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                            >
                              {sub}
                              <button
                                type="button"
                                onClick={() => handleRemoveSubject(sub)}
                                className="w-4 h-4 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-bold transition-colors"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Dropdown to add subjects */}
                        <select
                          className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-100 h-11 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddSubject(e.target.value);
                              e.target.value = ""; // Reset dropdown
                            }
                          }}
                        >
                          <option value="">Select a subject to add...</option>
                          {allSubjects
                            .filter((sub) => !selectedSubjects.includes(sub))
                            .map((sub, idx) => (
                              <option key={idx} value={sub} className="bg-zinc-800">
                                {sub}
                              </option>
                            ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-zinc-700/50">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 h-11 text-base font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate("/profile")}
                    variant="outline"
                    className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-11 text-base font-medium"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
