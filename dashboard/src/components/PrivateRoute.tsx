import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Navbar from "./Navbar"

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Outlet />
      </div>
    </>
  )
}
