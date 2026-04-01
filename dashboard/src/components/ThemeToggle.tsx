import { useTheme } from "../context/ThemeContext"

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-500
        ${isDarkMode 
          ? "bg-slate-900/40 border-white/10 shadow-[0_0_20px_rgba(30,41,59,0.5)]" 
          : "bg-white/80 border-slate-200 shadow-lg shadow-slate-200/50"}
        border backdrop-blur-xl hover:scale-110 active:scale-90
      `}
      aria-label="Toggle theme"
    >
      {/* Dynamic Background Ring */}
      <div className={`
        absolute inset-0 rounded-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100
        ${isDarkMode ? "bg-sky-400/10" : "bg-amber-400/10"}
      `} />

      <div className={`relative h-6 w-6 transition-transform duration-700 ${isDarkMode ? "rotate-[360deg]" : "rotate-0"}`}>
        {/* Sun Icon */}
        <div 
          className={`absolute inset-0 transition-all duration-500 transform 
            ${isDarkMode ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M22 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
          </svg>
        </div>
        
        {/* Moon Icon */}
        <div 
          className={`absolute inset-0 transition-all duration-500 transform 
            ${isDarkMode ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
        </div>
      </div>

      {/* Subtle indicator dots */}
      <div className="absolute bottom-1.5 flex gap-1 transform transition-all duration-500 scale-75 opacity-30 group-hover:opacity-100 group-hover:scale-100">
        <div className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-amber-200"}`} />
        <div className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-sky-400" : "bg-slate-200"}`} />
        <div className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-amber-200"}`} />
      </div>
    </button>
  )
}
