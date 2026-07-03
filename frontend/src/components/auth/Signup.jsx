import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Signup({ setIsSignupOpen, setIsLoginOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    department: "IT",
    semester: "",
    phoneNumber: "0000000000",
  });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!input.fullname || !input.email || !input.password || !input.semester) {
      toast.error("Please fill in all required fields.");
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await axios.post("http://localhost:8000/api/v1/user/signup", input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });

      if (setIsSignupOpen) {
        setIsSignupOpen(false);
      }
      if (response.data.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Signup failed", errorMsg);
      toast.error(errorMsg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSwitchToLogin = () => {
    if (setIsSignupOpen) {
      setIsSignupOpen(false);
      setIsLoginOpen(true);
    } else {
      navigate("/login");
    }
  };

  const formContent = (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
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

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-zinc-300">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={input.email}
            onChange={handleChange}
            className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>

        <div className="grid gap-2">
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



        <div className="grid gap-2">
          <Label htmlFor="semester" className="text-zinc-300">Semester</Label>
          <Select onValueChange={(value) => setInput({ ...input, semester: value })}>
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-emerald-500/20">
              <SelectValue placeholder="Select your semester" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {[3, 4, 5, 6, 7, 8].map((sem) => (
                <SelectItem key={sem} value={sem.toString()} className="text-zinc-100 focus:bg-emerald-500/20">
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>



        <Button
          onClick={handleSignup}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 mt-2"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="text-center text-zinc-400 text-sm">
          Already have an account?{" "}
          <span
            onClick={handleSwitchToLogin}
            className="text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors duration-200"
          >
            Login
          </span>
        </div>
      </div>
    </>
  );

  if (setIsSignupOpen) {
    return (
      <Dialog open={true} onOpenChange={(openState) => { if (!openState) setIsSignupOpen(false); }}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 border border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Create Account
            </DialogTitle>
            <p className="text-zinc-400 text-sm">
              Join our community and start your journey
            </p>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-[425px] bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Join our community and start your journey
          </p>
        </div>
        {formContent}
      </div>
    </div>
  );
}