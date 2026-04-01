import axios from "axios"
import type { SensorData, DeviceStatus } from "../types/sensor"

interface User {
    id: string
    name: string
    email: string
    role: "user" | "admin"
}

interface AuthResponse {
    success: boolean
    token?: string
    user: User
    message?: string
}

interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    message?: string
}

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
})

// Add token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("smart-energy-dashboard-token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Auth endpoints
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await API.post<AuthResponse>("/auth/register", { name, email, password })
    return res.data
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await API.post<AuthResponse>("/auth/login", { email, password })
    return res.data
}

export const getMe = async (): Promise<AuthResponse> => {
    const res = await API.get<AuthResponse>("/auth/me")
    return res.data
}

// Sensor endpoints
export const getSensorData = async (): Promise<SensorData[]> => {
    const res = await API.get<ApiResponse<SensorData[]>>("/sensors/latest")
    return res.data.data || []
}

export const getDeviceStatus = async (): Promise<DeviceStatus> => {
    const res = await API.get<DeviceStatus>("/device/status")
    return res.data
}

export const updateDevice = async (data: DeviceStatus): Promise<ApiResponse<DeviceStatus>> => {
    const res = await API.post<ApiResponse<DeviceStatus>>("/device/update", data)
    return res.data
}