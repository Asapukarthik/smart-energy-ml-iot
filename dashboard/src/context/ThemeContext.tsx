import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = "smart-energy-theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        return stored === "dark"
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Immediate class application
    if (isDarkMode) {
      root.classList.add("dark")
      localStorage.setItem(STORAGE_KEY, "dark")
      // Update meta theme color for mobile browsers
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute("content", "#0a0f1c")
    } else {
      root.classList.remove("dark")
      localStorage.setItem(STORAGE_KEY, "light")
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute("content", "#ffffff")
    }
  }, [isDarkMode])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only sync if user hasn't manually set a preference in this session
      // For simplicity, we'll just check if there's no stored preference
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === null) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleTheme = () => setIsDarkMode((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
