import { useEffect, useState } from "react"

interface PredictionResponse {
  success: boolean
  occupied: 0 | 1
  wastage: 0 | 1
  action: string
  confidence?: number
  error?: string
}

interface AIPredictorProps {
  data?: PredictionResponse | null
  loading?: boolean
  error?: string | null
}

export default function AIPredictor({ data, loading = false, error = null }: AIPredictorProps) {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [data])

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/40 bg-red-500/10 backdrop-blur-md p-6 shadow-lg dark:shadow-red-900/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h3 className="font-semibold text-red-600 dark:text-red-400">Prediction Error</h3>
            <p className="text-sm text-red-500 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-400/20 bg-white dark:bg-white/5 backdrop-blur-md p-6 shadow-sm dark:shadow-lg animate-pulse">
        <div className="space-y-4">
          <div className="h-12 bg-slate-400/20 rounded-lg w-3/4"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-slate-400/20 rounded-lg"></div>
            <div className="h-20 bg-slate-400/20 rounded-lg"></div>
          </div>
          <div className="h-16 bg-slate-400/20 rounded-lg"></div>
        </div>
      </div>
    )
  }

  // No data
  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-400/20 bg-white dark:bg-white/5 backdrop-blur-md p-6 shadow-sm dark:shadow-lg text-center">
        <p className="text-slate-500 dark:text-slate-400">No prediction data available</p>
      </div>
    )
  }

  const occupancyStatus = data.occupied === 1 ? "Occupied" : "Empty"
  const wastageStatus = data.wastage === 1 ? "Detected" : "Normal"

  const occupancyBgColor = data.occupied === 1 ? "bg-blue-500/10 border-blue-500/30 dark:bg-blue-500/20 dark:border-blue-400/40" : "bg-purple-500/10 border-purple-500/30 dark:bg-purple-500/20 dark:border-purple-400/40"
  const occupancyTextColor = data.occupied === 1 ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"

  const wastageBgColor = data.wastage === 1 ? "bg-red-500/10 border-red-500/30 dark:bg-red-500/20 dark:border-red-400/40" : "bg-green-500/10 border-green-500/30 dark:bg-green-500/20 dark:border-green-400/40"
  const wastageTextColor = data.wastage === 1 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"

  const actionBgColor = data.wastage === 1 ? "bg-red-500/10 border-red-500/30 dark:bg-red-500/20 dark:border-red-400/40" : "bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-500/20 dark:border-emerald-400/40"
  const actionTextColor = data.wastage === 1 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"

  return (
    <div className={`space-y-4 transition-all duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
      {/* Header */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-400/20 bg-white dark:bg-white/5 backdrop-blur-md p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Energy Prediction</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time ML Analysis</p>
          </div>
          <div className="text-2xl">🤖</div>
        </div>
      </div>

      {/* Occupancy & Wastage Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Occupancy Card */}
        <div className={`rounded-xl border p-4 shadow-sm dark:shadow-lg transition-all duration-300 hover:shadow-md dark:hover:shadow-xl ${occupancyBgColor}`}>
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">Occupancy</p>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-2xl font-bold ${occupancyTextColor}`}>{occupancyStatus}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{data.occupied === 1 ? "People Detected" : "No Activity"}</p>
            </div>
            <span className="text-3xl">{data.occupied === 1 ? "👤" : "🚪"}</span>
          </div>
        </div>

        {/* Wastage Card */}
        <div className={`rounded-xl border p-4 shadow-sm dark:shadow-lg transition-all duration-300 hover:shadow-md dark:hover:shadow-xl ${wastageBgColor}`}>
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">Wastage</p>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-2xl font-bold ${wastageTextColor}`}>{wastageStatus}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{data.wastage === 1 ? "Energy Leak Found" : "Efficient"}</p>
            </div>
            <span className="text-3xl">{data.wastage === 1 ? "⚡" : "✅"}</span>
          </div>
        </div>
      </div>

      {/* Action Card */}
      <div className={`rounded-xl border p-4 shadow-sm dark:shadow-lg ${actionBgColor}`}>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide mb-2">Recommended Action</p>
        <p className={`text-lg font-bold ${actionTextColor}`}>{data.action}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {data.wastage === 1 
            ? "Energy wastage detected. System recommends reducing consumption." 
            : "System operating normally. No action needed."}
        </p>
      </div>

      {/* Confidence Meter (if available) */}
      {data.confidence !== undefined && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-400/20 bg-white dark:bg-white/5 backdrop-blur-md p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wide">Prediction Confidence</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{Math.round(data.confidence * 100)}%</p>
          </div>
          <div className="h-2 bg-slate-700/40 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                data.confidence >= 0.8
                  ? "bg-emerald-500"
                  : data.confidence >= 0.6
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${data.confidence * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
