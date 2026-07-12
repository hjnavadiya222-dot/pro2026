"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { logoutUser } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Menu,
  X,
  GraduationCap,
  Users,
  LogOut,
  User,
  MessageSquare,
  CheckCircle2,
  Clock,
  Home,
  HelpCircle,
  Layers,
  BookOpen,
} from "lucide-react";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      /* ignore */
    }
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith("/dashboard#") && pathname === "/dashboard") {
      const hash = href.split("#")[1];
      window.location.hash = "";
      setTimeout(() => {
        window.location.hash = hash;
      }, 50);
    } else {
      router.push(href);
    }
    setMobileOpen(false);
  };

  const studentLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/ask", label: "Ask Question", icon: HelpCircle },
    { href: "/dashboard#directory-section", label: "Faculty Directory", icon: BookOpen },
    { href: "/dashboard/questions", label: "My Questions", icon: MessageSquare },
    { href: "/dashboard/solved", label: "Solved", icon: CheckCircle2 },
    { href: "/dashboard/unsolved", label: "Pending", icon: Clock },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const facultyLinks = [
    { href: "/faculty/dashboard", label: "Dashboard", icon: Home },
    { href: "/faculty/questions", label: "All Questions", icon: MessageSquare },
    { href: "/faculty/questions/solved", label: "Solved", icon: CheckCircle2 },
    { href: "/faculty/questions/pending", label: "Pending", icon: Clock },
    { href: "/faculty/profile", label: "Profile", icon: User },
  ];

  const links =
    user?.role === "Faculty"
      ? facultyLinks
      : user?.role === "Student"
      ? studentLinks
      : [];

  const initials = user?.fullname
    ?.split(" ")
    .filter((w) => !["Prof.", "Dr.", "Ms.", "(Dr.)"].includes(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => router.push(user ? (user.role === "Faculty" ? "/faculty/dashboard" : "/dashboard") : "/")}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-400 flex items-center justify-center">
            <Layers size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wider hidden sm:block">
            Ask<span className="text-white/40">Verse</span>
          </span>
        </button>

        {/* Desktop Links */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <button
                key={href}
                onClick={() => handleLinkClick(href)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  pathname === href
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Avatar */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    user.role === "Faculty"
                      ? "bg-gradient-to-br from-purple-600 to-blue-600"
                      : "bg-gradient-to-br from-teal-500 to-blue-600"
                  }`}
                >
                  {user.profile?.profilePicture?.url &&
                  !user.profile.profilePicture.url.includes("encrypted-tbn0") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profile.profilePicture.url}
                      alt={user.fullname}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-white text-xs font-medium leading-tight">
                    {user.fullname.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <p className="text-white/40 text-[10px]">{user.role}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-white/40 hover:text-red-400 transition-colors text-xs"
                title="Logout"
              >
                <LogOut size={15} />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/faculty-login")}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
              >
                <GraduationCap size={14} /> Faculty
              </button>
              <button
                onClick={() => router.push("/student-login")}
                className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                <Users size={14} /> Student
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          {user && (
            <button
              className="md:hidden text-white/60 hover:text-white transition-colors ml-1"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && user && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleLinkClick(href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                pathname === href
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
