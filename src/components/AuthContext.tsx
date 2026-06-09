"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'BUYER' | 'VENDOR';
  companyId?: string;
  companyName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, role?: 'ADMIN' | 'BUYER' | 'VENDOR') => Promise<boolean>;
  loginWithGoogle: (role: 'ADMIN' | 'BUYER' | 'VENDOR') => Promise<boolean>;
  register: (name: string, email: string, role: 'ADMIN' | 'BUYER' | 'VENDOR', companyName?: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('user_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem('user_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role?: 'ADMIN' | 'BUYER' | 'VENDOR') => {
    setLoading(true);
    try {
      // API Login mockup, query the mock db / users route
      const cleanEmail = email.toLowerCase().trim();
      let selectedRole = role;
      let name = 'User';
      let companyName = 'Acme Corp';
      let id = 'u-buyer';

      if (cleanEmail.includes('buyer')) {
        selectedRole = 'BUYER';
        name = 'Alex Harrison';
        companyName = 'Acme Procurement Corp';
        id = 'u-buyer';
      } else if (cleanEmail.includes('vendor')) {
        selectedRole = 'VENDOR';
        name = 'Sanjay Kumar';
        companyName = 'Nexis Tech Systems';
        id = 'u-vendor';
      } else if (cleanEmail.includes('admin')) {
        selectedRole = 'ADMIN';
        name = 'Sarah Connor';
        companyName = 'Acme Procurement Corp';
        id = 'u-admin';
      } else {
        selectedRole = role || 'BUYER';
        name = email.split('@')[0];
        id = 'u-' + Math.random().toString(36).substring(2, 9);
      }

      const sessionUser: AuthUser = {
        id,
        name,
        email: cleanEmail,
        role: selectedRole,
        companyName
      };

      localStorage.setItem('user_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
      
      // Redirect based on role
      redirectUser(selectedRole);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (role: 'ADMIN' | 'BUYER' | 'VENDOR') => {
    setLoading(true);
    // Simulate Google Login Popup
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const email = `${role.toLowerCase()}@google-oauth.com`;
    const sessionUser: AuthUser = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      name: `Google User (${role})`,
      email,
      role,
      companyName: role === 'VENDOR' ? 'Google Supplier Partners' : 'Google Enterprise'
    };

    localStorage.setItem('user_session', JSON.stringify(sessionUser));
    setUser(sessionUser);
    redirectUser(role);
    setLoading(false);
    return true;
  };

  const register = async (name: string, email: string, role: 'ADMIN' | 'BUYER' | 'VENDOR', companyName?: string) => {
    setLoading(true);
    try {
      // Simulate API registration call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const sessionUser: AuthUser = {
        id: 'u-' + Math.random().toString(36).substring(2, 9),
        name,
        email: email.toLowerCase().trim(),
        role,
        companyName: companyName || 'Independent'
      };

      localStorage.setItem('user_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
      redirectUser(role);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    router.push('/login');
  };

  const resetPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // mock network call
    return true;
  };

  const redirectUser = (role: 'ADMIN' | 'BUYER' | 'VENDOR') => {
    if (role === 'ADMIN') {
      router.push('/admin');
    } else if (role === 'VENDOR') {
      router.push('/vendor');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
