import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export default function FacultySignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    department: "Computer Engineering",
  });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email || !input.password || !input.confirmPassword || !input.designation || !input.department) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Email validation: must end with @scet.ac.in
    const emailRegex = /^[a-zA-Z0-9._%+-]+@scet\.ac\.in$/;
    if (!emailRegex.test(input.email)) {
      toast.error("Only official college emails ending in @scet.ac.in are allowed.");
      return;
    }

    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await axios.post("http://localhost:8000/api/v1/user/register-faculty", {
        fullname: input.fullname,
        email: input.email,
        password: input.password,
        designation: input.designation,
        department: input.department
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Account registered successfully! You can now log in.");
        navigate("/faculty/login");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Faculty signup failed:", errorMsg);
      toast.error(errorMsg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-zinc-950 to-teal-500/5" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 opacity-20 blur-3xl">
          <div className="absolute h-full w-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30" />
        </div>
      </div>

      <div className="w-full max-w-lg my-8">
        <div className="text-left mb-4">
          <button
            onClick={() => navigate("/faculty/login")}
            className="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition duration-200"
          >
            &larr; Back to Login
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto mb-4">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">
              Faculty Registration
            </h2>
            <p className="text-zinc-400">Register with your official scet.ac.in listed email</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-zinc-300">Full Name</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  placeholder="Enter your full name"
                  value={input.fullname}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Official College Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="username@scet.ac.in"
                  value={input.email}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Designation</Label>
                <Select onValueChange={(value) => setInput({ ...input, designation: value })}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-emerald-500/20">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="Professor" className="text-zinc-100">Professor</SelectItem>
                    <SelectItem value="Associate Professor" className="text-zinc-100">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor" className="text-zinc-100">Assistant Professor</SelectItem>
                    <SelectItem value="Laboratory Assistant" className="text-zinc-100">Laboratory Assistant</SelectItem>
                    <SelectItem value="Laboratory Attendant" className="text-zinc-100">Laboratory Attendant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-zinc-300">Department</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Computer Engineering"
                  value={input.department}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={input.password}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={input.confirmPassword}
                  onChange={handleChange}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 mt-4"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Registering...</span>
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <div className="text-center text-zinc-400 text-sm mt-6">
            Already registered?{" "}
            <button
              onClick={() => navigate("/faculty/login")}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Log in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
