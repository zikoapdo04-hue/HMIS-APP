import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { AuthService } from '../services/auth.service'
import type { UserModel } from '../models/user.model'

// ─────────────────────────────────────────────────────────────────────────────
// AuthContext — wraps Firebase Auth state.
// UI components use useAuth(); they never touch the Firebase SDK directly.
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user:       UserModel | null
  loading:    boolean
  login:      (email: string, password: string) => Promise<UserModel | null>
  logout:     () => Promise<void>
  updateUser: (partial: Partial<UserModel>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<UserModel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        const profile = await AuthService.getCurrentUserProfile(firebaseUser.uid)
        setUser(profile)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(email: string, password: string): Promise<UserModel | null> {
    const profile = await AuthService.login(email, password)
    setUser(profile)
    return profile
  }

  async function logout(): Promise<void> {
    await AuthService.logout()
    setUser(null)
  }

  function updateUser(partial: Partial<UserModel>): void {
    setUser(prev => (prev ? { ...prev, ...partial } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
