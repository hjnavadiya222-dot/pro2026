import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export default function FacultyLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [input, setInput] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password) {
      toast.error("Please enter email and password.");
      return;
    }

    // Email Validation: Only allow faculty emails from @scet.ac.in
    const emailRegex = /^[a-zA-Z0-9._%+-]+@scet\.ac\.in$/;
    if (!emailRegex.test(input.email)) {
      toast.error("Only official faculty emails from @scet.ac.in are allowed on this page!");
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await axios.post("http://localhost:8000/api/v1/user/login", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const loggedUser = response.data.user;

      if (loggedUser.role !== "Faculty") {
        toast.error("Access Denied: You are not registered as Faculty.");
        // Logout immediately by clearing credentials
        await axios.get("http://localhost:8000/api/v1/user/logout", { withCredentials: true });
        dispatch(setUser(null));
        return;
      }

      dispatch(setUser(loggedUser));
      toast.success("Login successful!");
      navigate("/faculty/homepage");
    } catch (error) {
      console.error("Login failed", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Invalid credentials or login failed.");
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

      <div className="w-full max-w-md">
        {/* Back Link to Home */}
        <div className="text-left mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition duration-200"
          >
            &larr; Back to Home
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto mb-4">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">
              Faculty Portal
            </h2>
            <p className="text-zinc-400">Log in to view and resolve student doubts</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Official College Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="username@scet.ac.in"
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={input.password}
                onChange={(e) => setInput({ ...input, password: e.target.value })}
                className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="text-center text-zinc-400 text-sm mt-6">
            Listed faculty member?{" "}
            <button
              onClick={() => navigate("/faculty/signup")}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Register your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
