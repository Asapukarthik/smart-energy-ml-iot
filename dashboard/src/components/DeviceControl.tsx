import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { getDeviceStatus, updateDevice } from "../services/api"
import type { DeviceStatus } from "../types/sensor"
export default function DeviceControl() {
    const { user } = useAuth()
    const [device, setDevice] = useState<DeviceStatus>({
        light: false,
        fan: false,
    })

    const [isSaving, setIsSaving] = useState(false)
    const isAdmin = user?.role === "admin"

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        const data = await getDeviceStatus()
        if (data) setDevice(data)
    }

    const toggle = async (type: "light" | "fan") => {
        if (!isAdmin) return; // Guard clause
        const newState = { ...device, [type]: !device[type] }
        setDevice(newState)
        setIsSaving(true)
        try {
            await updateDevice(newState)
        } finally {
            setIsSaving(false)
        }
    }

    const statusText = useMemo(() => {
        const active = Object.entries(device).filter(([, value]) => value)
        if (!active.length) return "All devices are off"
        return `${active.map(([key]) => key).join(" + ")} enabled`
    }, [device])

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm dark:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Device Control</h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">IoT Master Switches</p>
                </div>
                <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all duration-500
                    ${isSaving ? "bg-amber-400/10 border-amber-400/20 text-amber-400" : "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isSaving ? "animate-pulse bg-amber-400" : "bg-emerald-400"}`} />
                    {isSaving ? "Syncing..." : "Synced"}
                </div>
            </div>

            <div className="grid gap-4">
                {/* Light Control */}
                <button
                    onClick={() => toggle("light")}
                    disabled={isSaving || !isAdmin}
                    className={`group relative flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-300 active:scale-[0.98]
                        ${!isAdmin ? "cursor-not-allowed grayscale-[0.5]" : "cursor-pointer"}
                        ${device.light 
                            ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                            : "border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-white/10"}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 
                            ${device.light ? "bg-emerald-500 shadow-lg shadow-emerald-500/40" : "bg-slate-700/50 text-slate-400 group-hover:text-slate-200"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
                                <path d="M9 18h6"/><path d="M10 22h4"/>
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white tracking-wide">Main Light</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Smart LED Module</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${device.light ? "text-emerald-400" : "text-slate-500"}`}>
                            {device.light ? "Enabled" : "Disabled"}
                        </span>
                        <div className={`h-1.5 w-8 rounded-full bg-slate-700/50 overflow-hidden`}>
                            <div className={`h-full transition-all duration-500 ${device.light ? "w-full bg-emerald-500" : "w-0 bg-slate-500"}`} />
                        </div>
                    </div>
                </button>

                {/* Fan Control */}
                <button
                    onClick={() => toggle("fan")}
                    disabled={isSaving || !isAdmin}
                    className={`group relative flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-300 active:scale-[0.98]
                        ${!isAdmin ? "cursor-not-allowed grayscale-[0.5]" : "cursor-pointer"}
                        ${device.fan 
                            ? "border-sky-500/50 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.1)]" 
                            : "border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-white/10"}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 
                            ${device.fan ? "bg-sky-500 shadow-lg shadow-sky-500/40" : "bg-slate-700/50 text-slate-400 group-hover:text-slate-200"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={device.fan ? "animate-spin-slow" : ""}>
                                <path d="M12 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/><path d="m12 12 9 4.5"/><path d="m12 12-9 4.5"/><path d="M12 12V3"/>
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white tracking-wide">Ventilation Fan</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Auto-Speed Control</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${device.fan ? "text-sky-400" : "text-slate-500"}`}>
                            {device.fan ? "Active" : "Static"}
                        </span>
                        <div className={`h-1.5 w-8 rounded-full bg-slate-700/50 overflow-hidden`}>
                            <div className={`h-full transition-all duration-500 ${device.fan ? "w-full bg-sky-500" : "w-0 bg-slate-500"}`} />
                        </div>
                    </div>
                </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {!isAdmin && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <p className="text-[10px] font-bold text-amber-500/90 uppercase tracking-wider">Admin-Only Access Required to Operate</p>
                    </div>
                )}
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>System Insight</span>
                    <span className="text-slate-300">{statusText}</span>
                </div>
            </div>
        </div>
    )
}
