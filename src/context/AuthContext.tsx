"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { DEMO_USERS, SESSION_KEY, USERS_KEY } from "@/lib/constants";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (
    email: string,
    password?: string,
    adminCode?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password?: string,
    department?: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage / Supabase on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedEmail = localStorage.getItem(SESSION_KEY);
        if (storedEmail) {
          const cleanEmail = storedEmail.toLowerCase();

          // Try fetching user profile from Supabase first
          if (isSupabaseConfigured && supabase) {
            try {
              const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("email", cleanEmail)
                .maybeSingle();

              if (!error && data) {
                setUser({
                  name: data.name,
                  email: data.email,
                  password: data.password || undefined,
                  department: data.department || "General",
                  role: data.role || "student",
                  avatar: data.avatar || undefined,
                });
                setIsLoading(false);
                return;
              }
            } catch (dbErr) {
              console.warn("Could not fetch user profile from Supabase:", dbErr);
            }
          }

          // Local storage fallback
          const storedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
          const found = storedUsers.find(
            (u) => u.email.toLowerCase() === cleanEmail
          );
          if (found) {
            setUser(found);
          } else {
            const demo = DEMO_USERS.find(
              (u) => u.email.toLowerCase() === cleanEmail
            );
            if (demo) {
              setUser(demo);
            } else {
              const fallback: User = {
                name: cleanEmail.split("@")[0],
                email: cleanEmail,
                role: cleanEmail.includes("admin") || cleanEmail.includes("warden") ? "admin" : "student",
              };
              setUser(fallback);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load auth session", e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Please enter your college email ID." };
    }

    // Check demo accounts
    const demo = DEMO_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (demo) {
      localStorage.setItem(SESSION_KEY, demo.email);
      setUser(demo);
      return { success: true };
    }

    // Try Supabase database lookup
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", cleanEmail)
          .maybeSingle();

        if (profile) {
          const userObj: User = {
            name: profile.name,
            email: profile.email,
            password: profile.password || password,
            department: profile.department || "General",
            role: profile.role || "student",
          };
          localStorage.setItem(SESSION_KEY, userObj.email);
          setUser(userObj);
          return { success: true };
        }
      } catch (err) {
        console.warn("Supabase profile lookup failed:", err);
      }
    }

    try {
      const storedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const found = storedUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanEmail &&
          (!password || !u.password || u.password === password)
      );

      if (found) {
        localStorage.setItem(SESSION_KEY, found.email);
        setUser(found);
        return { success: true };
      }

      // Create new user profile if first time logging in
      const newUser: User = {
        name: cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email: cleanEmail,
        password: password || "demo123",
        role: "student",
      };
      storedUsers.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));
      localStorage.setItem(SESSION_KEY, newUser.email);
      setUser(newUser);

      // Sync to Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("profiles").upsert([
            {
              email: newUser.email,
              name: newUser.name,
              password: newUser.password,
              role: newUser.role,
            },
          ]);
        } catch (e) {
          console.error("Failed to sync profile to Supabase:", e);
        }
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: "An unexpected error occurred during login." };
    }
  };

  const adminLogin = async (
    email: string,
    password?: string,
    adminCode?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Please enter your administrative email address." };
    }

    // Verify admin code if provided
    const validCodes = ["ADMIN123", "QPARK2026", "PARK-ADMIN", "ADMIN"];
    if (adminCode && adminCode.trim() && !validCodes.includes(adminCode.trim().toUpperCase())) {
      return { success: false, error: "Invalid Admin Authorization Passkey." };
    }

    const adminUser: User = {
      name: cleanEmail.includes("warden")
        ? "Campus Warden / Chief Administrator"
        : cleanEmail.includes("dean")
        ? "Dean of Academic Affairs"
        : cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " (Admin)",
      email: cleanEmail,
      password: password || "admin123",
      department: "Administration",
      role: "admin",
    };

    localStorage.setItem(SESSION_KEY, adminUser.email);
    setUser(adminUser);

    try {
      const storedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const idx = storedUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail);
      if (idx >= 0) {
        storedUsers[idx] = { ...storedUsers[idx], role: "admin" };
      } else {
        storedUsers.push(adminUser);
      }
      localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));
    } catch (e) {}

    // Sync to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("profiles").upsert([
          {
            email: adminUser.email,
            name: adminUser.name,
            password: adminUser.password,
            department: adminUser.department,
            role: "admin",
          },
        ]);
      } catch (e) {
        console.error("Failed to sync admin profile to Supabase:", e);
      }
    }

    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    password?: string,
    department?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail) {
      return { success: false, error: "Name and email are required." };
    }

    try {
      const storedUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (storedUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: "An account already exists with this email." };
      }

      const newUser: User = {
        name: cleanName,
        email: cleanEmail,
        password: password || "password",
        department: department || "General",
        role: "student",
      };

      storedUsers.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));
      localStorage.setItem(SESSION_KEY, newUser.email);
      setUser(newUser);

      // Sync to Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("profiles").upsert([
            {
              email: newUser.email,
              name: newUser.name,
              password: newUser.password,
              department: newUser.department,
              role: newUser.role,
            },
          ]);
        } catch (e) {
          console.error("Failed to insert profile into Supabase:", e);
        }
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: "Failed to create account." };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        adminLogin,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
