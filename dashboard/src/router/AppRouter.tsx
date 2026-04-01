import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"
import { ThemeProvider } from "../context/ThemeContext"
import Dashboard from "../pages/Dashboard"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Current from "../pages/Current"
import Motion from "../pages/Motion"
import Temperature from "../pages/Temperature"
import Voltage from "../pages/Voltage"
import PrivateRoute from "../components/PrivateRoute"

export default function AppRouter() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}> 
              <Route path="/" element={<Dashboard />} />
              <Route path="/temperature" element={<Temperature />} />
              <Route path="/voltage" element={<Voltage />} />
              <Route path="/current" element={<Current />} />
              <Route path="/occupancy" element={<Motion />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}
