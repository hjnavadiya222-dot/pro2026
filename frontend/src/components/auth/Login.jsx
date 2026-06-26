import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";

export function Login({ isDialog = false, setIsLoginOpen, setIsSignupOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [input, setInput] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post("http://localhost:8000/api/v1/user/login", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      dispatch(setUser(response.data.user));
      if (isDialog) setIsLoginOpen(false);
      navigate("/homepage");
      toast("login is successfull");
    } catch (error) {
      console.error("Login failed", error.response?.data?.message || error.message);
      toast("login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  if (isDialog) {
    return (
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Welcome Back
          </DialogTitle>
        </DialogHeader>
        <div className="text-zinc-400 text-sm">
          Enter your credentials to access your account
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
              className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
            onClick={handleLogin}
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
          <div className="text-center text-zinc-400 text-sm">
            Don't have an account?{" "}
            <button
              onClick={handleSwitchToSignup}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </DialogContent>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Decorative Element */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 opacity-20 blur-3xl">
            <div className="absolute h-full w-full bg-gradient-to-br from-emerald-500/40 to-teal-500/40" />
          </div>
        </div>

        <div className="bg-zinc-800/30 backdrop-blur-sm p-8 rounded-lg border border-zinc-700/50 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h2>
            <p className="text-zinc-400">Enter your credentials to access your account</p>
          </div>
          <LoginForm input={input} handleChange={setInput} handleLogin={handleLogin} loading={loading} />
        </div>
      </div>
    </div>
  );
}

function LoginForm({ input, handleChange, handleLogin, loading }) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="email" className="text-zinc-300">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={input.email}
          onChange={(e) => handleChange({ ...input, email: e.target.value })}
          className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password" className="text-zinc-300">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={input.password}
          onChange={(e) => handleChange({ ...input, password: e.target.value })}
          className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
        />
      </div>
      <Button
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 mt-2"
        onClick={handleLogin}
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
      <div className="text-center text-zinc-400 text-sm">
        Don't have an account? <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Sign up</span>
      </div>
    </div>
  );
}
