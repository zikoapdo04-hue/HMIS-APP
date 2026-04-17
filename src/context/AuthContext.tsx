// src/context/AuthContext.tsx
import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from 'react';
import {
  onAuthStateChanged, signOut, type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { Role } from '../types';

/* ── Shapes ─────────────────────────────────────────────── */
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
}

interface AuthContextValue {
  user:    UserProfile | null;
  loading: boolean;
  logout:  () => Promise<void>;
}

/* ── Context ─────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue>({
  user: null, loading: true, logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

/* ── Provider ────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) { setUser(null); setLoading(false); return; }

      try {
        // Base user doc
        const userSnap = await getDoc(doc(db, 'users', fbUser.uid));
        if (!userSnap.exists()) { setUser(null); setLoading(false); return; }
        const base = userSnap.data() as { role: Role; name: string; email: string };

        let extras: Partial<UserProfile> = {};

        if (base.role === 'patient') {
          const pSnap = await getDoc(doc(db, 'patients', fbUser.uid));
          if (pSnap.exists()) extras = pSnap.data() as Partial<UserProfile>;
        }
        if (base.role === 'doctor') {
          const dSnap = await getDoc(doc(db, 'doctors', fbUser.uid));
          if (dSnap.exists()) extras = dSnap.data() as Partial<UserProfile>;
        }

        setUser({ uid: fbUser.uid, email: fbUser.email ?? '', ...base, ...extras });
      } catch {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
