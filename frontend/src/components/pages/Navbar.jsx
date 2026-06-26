/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "@/redux/authSlice";
import axios from "axios";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { User2, LogOut, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;

  // console.log(user?.role);
  

  // Logout Function
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      dispatch(setUser(null)); // Clear user from Redux
      navigate("/");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <nav className="sticky top-0 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100 shadow-xl z-50 backdrop-blur-sm">
      <div className="flex h-16 items-center px-6 container mx-auto justify-between flex-wrap">
        {/* Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer transform hover:scale-105 transition-transform duration-200"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-xl font-bold">A</span>
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
            Askverse
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated && (
            <>
            
              <Link
                to={user?.role === "Student" ? "/homepage" : "/faculty/homepage"}
                className="text-gray-300 hover:text-white transition duration-200"
              >
                Home
              </Link>
              <Link
                to={
                  user?.role === "Student"
                    ? "/allquestions"
                    : "/faculty/allquestions"
                }
                className="text-gray-300 hover:text-white transition duration-200"
              >
                All Questions
              </Link>
              <Link
                to={
                  user?.role === "Student"
                    ? "/solvedquestions"
                    : "/faculty/solved/questions"
                }
                className="text-gray-300 hover:text-white transition duration-200"
              >
                Solved Questions
              </Link>
              <Link
                to={
                  user?.role === "Student"
                    ? "/unsolvedquestions"
                    : "/faculty/unsolved/questions"
                }
                className="text-gray-300 hover:text-white transition duration-200"
              >
                Unsolved Questions
              </Link>
            </>
          )}
        </div>

        {/* Authentication & Profile Section */}
        <div className="flex items-center space-x-3">
          {!isAuthenticated ? (
            <>
              {/* Show Login and Signup Buttons */}
              <Button
                onClick={() => navigate("/login")}
                className="text-sm font-medium"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="text-sm font-medium bg-emerald-500"
              >
                Sign Up
              </Button>
            </>
          ) : (
            // Show Popover for Logged-in User
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-white/10 transition-all duration-200"
                >
                  <Avatar className="h-8 w-8 border-2 border-emerald-500/20">
                    <AvatarImage
                      src={user?.profile?.profilePicture?.url?.includes("gstatic.com") ? undefined : user?.profile?.profilePicture?.url}
                      alt={user?.fullname}
                    />
                    <AvatarFallback className="bg-emerald-500 text-white font-semibold">
                      {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown size={16} className="text-gray-400" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-48 p-2 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg">
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 justify-start hover:bg-gray-100 rounded-lg transition-all duration-200"
                    asChild
                  >
                    <Link
                      to="/profile"
                      className="text-gray-300 transition duration-200"
                    >
                      <User2 size={18} />
                      View Profile
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 justify-start text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </nav>
  );
}
