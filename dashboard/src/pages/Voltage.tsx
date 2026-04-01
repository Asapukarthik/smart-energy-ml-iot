import { useEffect, useState } from "react"
import SensorCard from "../components/SensorCard"
import ChartView from "../components/ChartView"
import { getSensorData } from "../services/api"
import type { SensorData } from "../types/sensor"

export default function Voltage() {
  const [data, setData] = useState<SensorData[]>([])

  const load = async () => {
    const res = await getSensorData()
    setData(res)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  const latest = data[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voltage</h1>
          <p className="mt-1 text-sm text-slate-200">Monitor voltage levels and see historical trends.</p>
        </div>
        <div className="rounded-lg bg-slate-200 dark:bg-white/10 px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
          Latest: <span className="font-semibold text-slate-900 dark:text-white font-mono">{typeof latest?.voltage === 'number' ? latest.voltage.toFixed(1) : "--"}V</span>
        </div>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <SensorCard title="Voltage" value={latest?.voltage ?? 0} unit="V" variant="voltage" />
        <ChartView data={data} metric="voltage" title="Voltage over time" />
      </div>
    </div>
  )
}
