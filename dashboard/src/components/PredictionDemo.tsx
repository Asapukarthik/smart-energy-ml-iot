/**
 * AI Predictor Demo Component
 * 
 * Complete working example showing:
 * - AIPredictor component with real predictions
 * - Real-time updates with auto-refresh
 * - Error handling and retry logic
 * - Integration with dashboard layout
 */

import { useState } from "react"
import AIPredictor from "./AIPredictor"
import { usePrediction } from "../hooks/usePrediction"

export default function PredictionDemo() {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(10000)

  // Fetch prediction with auto-refresh
  const { prediction, loading, error, fetchPrediction } = usePrediction(
    autoRefresh,
    autoRefresh ? refreshInterval : 0
  )

  const handleRetry = () => {
    fetchPrediction()
  }

  const handleToggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  const handleIntervalChange = (interval: number) => {
    setRefreshInterval(interval)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Energy Predictions</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Real-time machine learning predictions for occupancy and energy wastage detection
        </p>
      </div>

      {/* Controls */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-400/20 bg-white dark:bg-white/5 backdrop-blur-md p-4 shadow-sm dark:shadow-none">
        <div className="space-y-4">
          {/* Refresh Controls */}
          <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-400/10">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={handleToggleAutoRefresh}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto-Refresh</span>
              </label>
            </div>

            {autoRefresh && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Every</span>
                <select
                  value={refreshInterval}
                  onChange={(e) => handleIntervalChange(Number(e.target.value))}
                  className="px-3 py-1 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value={5000}>5 sec</option>
                  <option value={10000}>10 sec</option>
                  <option value={30000}>30 sec</option>
                  <option value={60000}>1 min</option>
                </select>
              </div>
            )}

            <button
              onClick={handleRetry}
              disabled={loading}
              className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition text-sm shadow-sm hover:shadow-md"
            >
              {loading ? "Fetching..." : "Refresh Now"}
            </button>
          </div>

          {/* Status Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              {autoRefresh
                ? `Auto-refreshing every ${refreshInterval / 1000}s`
                : "Manual refresh mode"}
            </span>
            {prediction && (
              <span>
                Last updated:{" "}
                {new Date().toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Prediction Display */}
      <div>
        <AIPredictor data={prediction} loading={loading} error={error} />
      </div>

      {/* Stats Section (if prediction available) */}
      {prediction && (
        <div className="grid grid-cols-3 gap-4">
          {/* Status Summary */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-400/20 bg-white dark:bg-white/5 backdrop-blur-md p-4 shadow-sm dark:shadow-none">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Status</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
              {prediction.occupied ? "Occupied" : "Empty"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {prediction.occupied ? "Activity Detected" : "No Activity"}
            </p>
          </div>

          {/* Energy Status */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-400/20 bg-white dark:bg-white/5 backdrop-blur-md p-4 shadow-sm dark:shadow-none">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Usage</p>
            <p className={`text-xl font-bold ${prediction.wastage ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
              {prediction.wastage ? "High" : "Normal"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {prediction.wastage ? "Wastage Detected" : "Efficient"}
            </p>
          </div>

          {/* Confidence */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-400/20 bg-white dark:bg-white/5 backdrop-blur-md p-4 shadow-sm dark:shadow-none">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Confidence
            </p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {prediction.confidence ? Math.round(prediction.confidence * 100) : "N/A"}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {prediction.confidence && prediction.confidence >= 0.8
                ? "High"
                : prediction.confidence && prediction.confidence >= 0.6
                  ? "Medium"
                  : "Low"}{" "}
              confidence
            </p>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-400/20 bg-white dark:bg-white/5 backdrop-blur-md p-4 shadow-sm dark:shadow-none">
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <span>ℹ️</span> How it Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">1. Data Collection</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                IoT sensors collect occupancy, temperature, humidity, current, and voltage data
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">2. ML Processing</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Backend sends data to Flask ML API with two trained models
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">3. Recommendations</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                System recommends actions to optimize energy consumption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info (Development Only) */}
      {import.meta.env.DEV && (
        <details className="text-xs">
          <summary className="cursor-pointer font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Debug: Raw Prediction Data
          </summary>
          <pre className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-white/5 overflow-auto text-slate-700 dark:text-slate-300">
            {JSON.stringify(prediction, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
