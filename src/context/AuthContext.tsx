import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Role } from '../types';

export interface UserProfile {
  uid:       string;
  email:     string;
  role:      Role;
  name:      string;
  // patient extras
  city?:     string;
  age?:      string;
  phone?:    string;
  // doctor extras
  specialty?: string;
  hospital?:  string;
  address?:   string;
  rating?:    number;
  days?:      string;
  // shared
  photoURL?:  string;
}

interface AuthContextValue {
  user:       UserProfile | null;
  loading:    boolean;
  login:      (profile: UserProfile) => void;
  logout:     () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, loading: true, login: () => {}, logout: () => {}, updateUser: () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (profile: UserProfile) => {
    setUser(profile);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
