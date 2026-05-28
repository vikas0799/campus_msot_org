'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  fullName: string;
  avatarUrl?: string;
  resumeUrl?: string;
  bio?: string;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    link?: string;
    githubLink?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date?: string;
    credentialUrl?: string;
  }>;
  codingProfiles: {
    github?: string;
    leetcode?: string;
    codeforces?: string;
    hackerrank?: string;
    codechef?: string;
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  achievements: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'campus_admin' | 'club_admin' | 'student';
  campus?: 'ghaziabad' | 'jaipur' | 'bangalore' | null;
  profile: UserProfile;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  updateUser: (updatedUser: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
