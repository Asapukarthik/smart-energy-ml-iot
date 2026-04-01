import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = "smart-energy-dashboard-user"
const TOKEN_KEY = "smart-energy-dashboard-token"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    }
    return null
  })

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  })

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      setUser(stored ? JSON.parse(stored) : null)
      setToken(localStorage.getItem(TOKEN_KEY))
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const login = useCallback((userData: User, authToken: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    localStorage.setItem(TOKEN_KEY, authToken)
    setUser(userData)
    setToken(authToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout, token }),
    [user, login, logout, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
