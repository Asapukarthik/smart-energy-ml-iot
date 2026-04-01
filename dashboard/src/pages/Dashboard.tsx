import { useEffect, useState } from "react"

import SensorCard from "../components/SensorCard"
import ChartView from "../components/ChartView"
import DeviceControl from "../components/DeviceControl"
import EnergyConsumption from "../components/EnergyConsumption"
import AlertToast, { type Alert } from "../components/AlertToast"
// import PredictionResult from "../components/PredictionResult"

import { getSensorData } from "../services/api"
import type { SensorData } from "../types/sensor"

export default function Dashboard() {

    const [data, setData] = useState<SensorData[]>([])
    const [loading, setLoading] = useState(true)
    const [alerts, setAlerts] = useState<Alert[]>([])

    const load = async () => {
        setLoading(true)
        const res = await getSensorData()
        setData(res)
        setLoading(false)
    }

    useEffect(() => {
        load()
        const id = setInterval(load, 5000)
        return () => clearInterval(id)
    }, [])

    const latest = data[0]
    const lastUpdated = latest ? new Date(latest.timestamp).toLocaleTimeString() : "--:--"

    // Derive mock prediction data based on the latest sensor readings
    // const predictionData = {
    //     roomStatus: (latest?.motion ? "occupied" : "empty") as "occupied" | "empty",
    //     action: (latest?.motion ? "idle" : "turning_off_both") as "turning_off_both" | "idle",
    //     confidence: 0.89,
    //     wastageSeverity: (latest?.motion ? "normal" : "high") as "normal" | "high",
    //     timestamp: latest?.timestamp
    // }

    // Alert engine based on latest data
    useEffect(() => {
        if (!latest) return

        const newAlerts: Alert[] = []

        // High current alert 
        const totalCurrent = (latest.ledCurrent || 0) + (latest.motorCurrent || 0);
        if (totalCurrent > 15) {
            newAlerts.push({
                id: `current-${latest.timestamp}`,
                type: "warning",
                message: `High Current Detected: ${totalCurrent.toFixed(2)}A`
            })
        }

        // High wastage alert (mock derived from occupancy)
        if (!latest.occupancy && totalCurrent > 0) {
            newAlerts.push({
                id: `wastage-${latest.timestamp}`,
                type: "error",
                message: "High Energy Wastage Alert! Room is empty but devices are drawing power."
            })
        }

        if (newAlerts.length > 0) {
            setAlerts(prev => {
                // Combine and keep only latest unique alerts
                const combined = [...prev, ...newAlerts]
                // Deduplicate by ID
                const uniqueIds = new Set()
                return combined.filter(a => {
                    const isDuplicate = uniqueIds.has(a.id)
                    uniqueIds.add(a.id)
                    return !isDuplicate
                }).slice(-5) // limit to max 5 on screen
            })
        }
    }, [latest])

    const dismissAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id))
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Smart Energy Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-slate-50 dark:bg-white/10 px-4 py-3 text-sm text-slate-600 dark:text-slate-200 border dark:border-none shadow-sm dark:shadow-none">
                        Last refresh: <span className="font-semibold text-slate-900 dark:text-white">{lastUpdated}</span>
                        <span className="ml-3 inline-flex items-center gap-2">
                            {loading ? (
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                            ) : (
                                <span className="h-2 w-2 rounded-full bg-slate-400" />
                            )}
                            {loading ? "Loading..." : "Live"}
                        </span>
                    </div>
                </div>
            </header>

            <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <SensorCard
                    title="Temperature"
                    value={latest?.temperature ?? 0}
                    unit="°C"
                    variant="temperature"
                />
                
                <SensorCard
                    title="Humidity"
                    value={latest?.humidity ?? 0}
                    unit="%"
                    variant="temperature"
                />

                <SensorCard
                    title="Voltage"
                    value={latest?.voltage ?? 0}
                    unit="V"
                    variant="voltage"
                />

                <SensorCard
                    title="Total Current"
                    value={(latest?.ledCurrent ?? 0) + (latest?.motorCurrent ?? 0)}
                    unit="A"
                    variant="current"
                />

                <SensorCard
                    title="Occupancy"
                    value={latest?.occupancy ? "Detected" : "None"}
                    variant="motion"
                />
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ChartView data={data} />
                </div>
                <div className="flex flex-col gap-6">
                    <DeviceControl />
                    <EnergyConsumption
                        voltage={latest?.voltage}
                        ledCurrent={latest?.ledCurrent}
                        motorCurrent={latest?.motorCurrent}
                        ledPower={latest?.ledPower}
                        motorPower={latest?.motorPower}
                    />
                </div>
            </section>

            <AlertToast alerts={alerts} onDismiss={dismissAlert} />
        </div>
    )
}
