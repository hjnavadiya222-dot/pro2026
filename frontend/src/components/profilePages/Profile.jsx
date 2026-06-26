import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "../pages/Navbar";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Phone, Building2, GraduationCap } from "lucide-react";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    return <div className="text-center text-red-500">User not found.</div>;
  }

  const handleEdit = () => {
    navigate("/edit/profile");
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      {/* Decorative Background */}
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
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Profile Header Card */}
          <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              {/* Profile Content */}
              <div className="absolute -bottom-16 w-full px-6 flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-32 w-32 border-4 border-zinc-800 shadow-xl ring-4 ring-emerald-500/20">
                  <AvatarImage
                    src={user?.profile?.profilePicture?.url?.includes("gstatic.com") ? undefined : user?.profile?.profilePicture?.url}
                    alt={user.fullname}
                  />
                  <AvatarFallback className="bg-emerald-500 text-white font-bold text-5xl">
                    {user.fullname?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="px-6 pt-20 pb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                    {user.fullname}
                  </h1>
                  <p className="text-zinc-400 mt-1">{user.email}</p>
                  <span className="inline-block px-3 py-1 mt-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                    {user.role}
                  </span>
                </div>
                <Button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 px-6"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>

          {/* User Details */}
          <Card className="bg-zinc-800/30 border-zinc-700/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                  {user.role === "Student" && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-emerald-500/10">
                        <GraduationCap className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Semester</p>
                        <p className="text-zinc-100 font-medium">{user.semester || 'Not specified'}</p>
                      </div>
                    </div>
                  )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
