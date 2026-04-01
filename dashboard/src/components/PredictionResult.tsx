import { type ReactNode } from "react"

interface PredictionData {
  roomStatus: "occupied" | "empty"
  action: "turning_off_fan" | "turning_off_light" | "turning_off_both" | "turning_on" | "idle"
  confidence: number
  wastageSeverity: "normal" | "moderate" | "high"
  timestamp?: string
}

interface PredictionResultProps {
  data: PredictionData
  loading?: boolean
  error?: string | null
}

const getStatusIcon = (status: string): ReactNode => {
  switch (status) {
    case "occupied":
      return "👤"
    case "empty":
      return "🚪"
    default:
      return "❓"
  }
}

const getActionIcon = (action: string): ReactNode => {
  switch (action) {
    case "turning_off_fan":
      return "🌀"
    case "turning_off_light":
      return "💡"
    case "turning_off_both":
      return "⚙️"
    case "turning_on":
      return "✅"
    case "idle":
      return "⏸️"
    default:
      return "🔧"
  }
}

const getActionLabel = (action: string): string => {
  switch (action) {
    case "turning_off_fan":
      return "Turning OFF fan"
    case "turning_off_light":
      return "Turning OFF light"
    case "turning_off_both":
      return "Turning OFF fan & light"
    case "turning_on":
      return "Turning ON devices"
    case "idle":
      return "System Idle"
    default:
      return "Processing..."
  }
}

const getStatusLabel = (status: string): string => {
  return status === "occupied" ? "Room Occupied" : "Room Empty"
}

const getWastageColor = (severity: string): string => {
  switch (severity) {
    case "high":
      return "from-red-500 to-red-600"
    case "moderate":
      return "from-orange-500 to-orange-600"
    case "normal":
      return "from-green-500 to-green-600"
    default:
      return "from-gray-500 to-gray-600"
  }
}

const getActionColor = (action: string, severity: string): string => {
  if (action === "turning_on" || action === "idle") {
    return "from-green-500 to-green-600"
  }
  
  if (severity === "high") {
    return "from-red-500 to-red-600"
  }
  if (severity === "moderate") {
    return "from-orange-500 to-orange-600"
  }
  return "from-green-500 to-green-600"
}

export default function PredictionResult({ data, loading = false, error = null }: PredictionResultProps) {
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-300 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚠️</span>
            <h3 className="text-lg font-bold text-red-800">Error Loading Predictions</h3>
          </div>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-lg p-6 animate-pulse">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-slate-300 rounded-full animate-spin"></div>
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-slate-300 rounded-lg w-3/4 mx-auto"></div>
            <div className="h-4 bg-slate-300 rounded-lg w-full"></div>
            <div className="h-4 bg-slate-300 rounded-lg w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  const statusColor = data.roomStatus === "occupied" ? "from-blue-500 to-blue-600" : "from-purple-500 to-purple-600"
  const actionColor = getActionColor(data.action, data.wastageSeverity)
  const wastageColor = getWastageColor(data.wastageSeverity)

  return (
    <div className="w-full max-w-md mx-auto transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">
        {/* Header Background */}
        <div className={`bg-gradient-to-r ${statusColor} p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl">{getStatusIcon(data.roomStatus)}</div>
            <div className="text-right">
              <p className="text-sm font-medium opacity-90">Room Status</p>
              <h2 className="text-2xl font-bold">{getStatusLabel(data.roomStatus)}</h2>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-90">Confidence Level</span>
            <span className="font-bold">{Math.round(data.confidence * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div 
              className={`bg-white/80 h-full rounded-full transition-all duration-300`}
              style={{ width: `${data.confidence * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Action Card */}
          <div className={`bg-gradient-to-br ${actionColor} rounded-2xl p-5 text-white shadow-lg transition-transform hover:scale-105`}>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{getActionIcon(data.action)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium opacity-90">System Action</p>
                <p className="text-lg font-bold">{getActionLabel(data.action)}</p>
              </div>
            </div>
          </div>

          {/* Wastage Severity */}
          <div className={`bg-gradient-to-br ${wastageColor} rounded-2xl p-4 text-white shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Energy Wastage</p>
                <p className="text-lg font-bold capitalize">{data.wastageSeverity} Level</p>
              </div>
              <div className="text-3xl">
                {data.wastageSeverity === "high" && "🔴"}
                {data.wastageSeverity === "moderate" && "🟠"}
                {data.wastageSeverity === "normal" && "🟢"}
              </div>
            </div>
          </div>

          {/* Timestamp */}
          {data.timestamp && (
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4 tabular-nums">
              Last updated: {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          )}

          {/* Status Badge */}
          <div className="flex justify-center gap-2">
            <span className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full border border-slate-200 dark:border-white/5 transition-colors">
              ✓ AI Powered
            </span>
            <span className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full border border-slate-200 dark:border-white/5 transition-colors">
              ⚡ Real-time
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
