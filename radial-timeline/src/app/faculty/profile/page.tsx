"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { updateProfile } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import toast from "react-hot-toast";
import { GraduationCap, Camera, Save, Loader2, Mail, Phone, Award, BookOpen, User } from "lucide-react";

export default function FacultyProfilePage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ fullname: "", phoneNumber: "", designation: "", qualification: "", experience: "", portfolio: "" });

  useEffect(() => { if (!loading && !user) router.push("/faculty-login"); }, [user, loading, router]);
  useEffect(() => {
    if (user) setForm({
      fullname: user.fullname || "",
      phoneNumber: user.phoneNumber || "",
      designation: user.designation || "",
      qualification: user.qualification || "",
      experience: user.experience || "",
      portfolio: user.portfolio || "",
    });
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!user?._id) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (fileRef.current?.files?.[0]) fd.append("profilePicture", fileRef.current.files[0]);
      const res = await updateProfile(user._id, fd);
      setUser({ ...user, ...res.data.user });
      toast.success("Profile updated successfully!");
      setEditing(false);
      setPreview(null);
    } catch {
      toast.error("Failed to update profile.");
    } finally { setSaving(false); }
  };

  if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" /></div>;

  const avatarUrl = preview || (user.profile?.profilePicture?.url && !user.profile.profilePicture.url.includes("encrypted-tbn0") ? user.profile.profilePicture.url : null);
  const initials = user.fullname.split(" ").filter(w => !["Prof.", "Dr.", "Ms.", "(Dr.)"].includes(w)).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all disabled:opacity-50";

  const infoFields = [
    { label: "Full Name", value: user.fullname, icon: User },
    { label: "Email", value: user.email, icon: Mail },
    { label: "Phone", value: user.phoneNumber, icon: Phone },
    { label: "Designation", value: user.designation || "—", icon: GraduationCap },
    { label: "Qualification", value: user.qualification || "—", icon: Award },
    { label: "Experience", value: user.experience || "—", icon: BookOpen },
    { label: "Department", value: user.department, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <GraduationCap size={19} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Faculty Profile</h1>
            <p className="text-white/40 text-xs">Manage your professional information</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 space-y-6">
          {/* Avatar + Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10 ring-offset-2 ring-offset-black">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={user.fullname} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                )}
              </div>
              {editing && (
                <button onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={18} />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold">{user.fullname}</h2>
              <p className="text-white/50 text-sm">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full font-medium">
                  <GraduationCap size={11} /> {user.designation || "Faculty"}
                </span>
              </div>
            </div>
          </div>



          {/* Info */}
          {!editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {infoFields.map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white/3 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={12} className="text-white/30" />
                    <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
                  </div>
                  <p className="text-white text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "fullname", label: "Full Name" },
                { key: "phoneNumber", label: "Phone" },
                { key: "designation", label: "Designation" },
                { key: "qualification", label: "Qualification" },
                { key: "experience", label: "Experience" },
                { key: "portfolio", label: "Portfolio / Links" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-white/50 text-xs uppercase tracking-wider">{label}</label>
                  <input value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className={inputCls} />
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex-1 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all">
                Edit Profile
              </button>
            ) : (
              <>
                <button onClick={() => { setEditing(false); setPreview(null); }} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Save size={15} /> Save Changes</>}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
