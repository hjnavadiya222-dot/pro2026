"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface UserProfile {
  _id: string;
  userId: string;
  fullname: string;
  email: string;
  role: "Student" | "Faculty" | "Admin";
  department: string;
  phoneNumber: string;
  semester?: number;
  subject?: string[];
  designation?: string;
  qualification?: string;
  experience?: string;
  portfolio?: string;
  isRegistered?: boolean;
  profile?: {
    profilePicture?: { url: string; public_id?: string };
    coverPhoto?: { url: string; public_id?: string };
  };
  questionsAsked?: string[];
  questionsAnswered?: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("scet_user");
      if (saved) setUserState(JSON.parse(saved));
    } catch {
      localStorage.removeItem("scet_user");
    }
    setLoading(false);
  }, []);

  const setUser = (u: UserProfile | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem("scet_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("scet_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
