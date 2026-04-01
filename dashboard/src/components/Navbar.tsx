import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ThemeToggle from "./ThemeToggle"

const navLinks = [
  {
    to: "/",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5 mb-0.5 md:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    )
  },
  {
    to: "/temperature",
    label: "Temperature",
    icon: (
      <svg className="w-5 h-5 mb-0.5 md:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11V3a3 3 0 016 0v8a5 5 0 11-6 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    )
  },
  {
    to: "/voltage",
    label: "Voltage",
    icon: (
      <svg className="w-5 h-5 mb-0.5 md:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    )
  },
  {
    to: "/current",
    label: "Current",
    icon: (
      <svg className="w-5 h-5 mb-0.5 md:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    )
  },
  {
    to: "/occupancy",
    label: "Occupancy",
    icon: (
      <svg className="w-5 h-5 mb-0.5 md:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>
    )
  }
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Get username from user object
  const username = user?.name || "Guest"
  const initial = username.charAt(0).toUpperCase()

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo on Left */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-white dark:to-slate-400 tracking-tight hidden sm:block">
              SmartEnergy
            </span>
          </div>

          {/* Desktop Navigation Links (Middle area) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-1 lg:space-x-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out flex flex-col items-center justify-center group ${
                      isActive 
                        ? "text-teal-600 dark:text-teal-400 bg-slate-100 dark:bg-slate-800/80 shadow-inner border border-slate-200 dark:border-white/5" 
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                    }`
                  }
                >
                  {link.icon}
                  <span className="hidden lg:block mt-0.5">{link.label}</span>
                  {/* Small tooltip like behavior for Medium screens */}
                  <span className="lg:hidden mt-0.5 text-xs">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* User Profile & Logout on Right */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-full pl-2 pr-4 py-1.5 border border-slate-200 dark:border-white/5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-default shadow-sm dark:shadow-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-inner shadow-teal-900/50 relative">
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full z-10"></span>
                {initial}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                {username}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 transition-all duration-200 shadow-sm shadow-transparent hover:shadow-rose-900/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          {/* Mobile Profile & Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <div className="scale-75 origin-right">
              <ThemeToggle />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-inner relative">
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full z-10"></span>
              {initial}
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Toggle menu"
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors border border-transparent focus:border-slate-200 dark:focus:border-white/10"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`md:hidden absolute w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-all duration-300 ease-in-out overflow-hidden shadow-2xl ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive 
                    ? "text-teal-600 dark:text-teal-400 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 shadow-inner" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent"
                }`
              }
            >
              <div className="text-current">
                 {link.icon}
              </div>
              <span className="flex-1 pb-0.5">{link.label}</span>
              <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </NavLink>
          ))}
          
          <div className="mt-4 pt-4 pb-1 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => {
                setIsMenuOpen(false)
                handleLogout()
              }}
              className="flex w-full items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-900/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
