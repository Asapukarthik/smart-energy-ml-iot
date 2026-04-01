import { useState, useEffect, useCallback } from "react"

interface PredictionData {
  success: boolean
  occupied: 0 | 1
  wastage: 0 | 1
  action: string
  confidence?: number
}

interface PredictionResponse {
  success: boolean
  message?: string
  data?: {
    sensor: {
      occupancy: number
      temperature: number
      humidity: number
      ledCurrent: number
      motorCurrent: number
      voltage: number
      ledPower: number
      motorPower: number
      timestamp: string
    }
    prediction: PredictionData
  }
  error?: string
}

interface UsePredictionReturn {
  prediction: PredictionData | null
  loading: boolean
  error: string | null
  fetchPrediction: () => Promise<void>
}

/**
 * Custom hook to fetch AI predictions from the backend API
 * The backend internally calls the Flask ML API and returns predictions
 */
export function usePrediction(autoFetch = false, pollInterval = 0): UsePredictionReturn {
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  const fetchPrediction = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("smart-energy-dashboard-token")

      if (!token) {
        setError("Not authenticated. Please log in first.")
        setLoading(false)
        return
      }

      // Get latest sensor data (which includes prediction from backend)
      const response = await fetch(`${baseUrl}/sensors/latest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data: PredictionResponse = await response.json()

      if (data.success && data.data?.prediction) {
        setPrediction(data.data.prediction)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch prediction")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prediction")
      setPrediction(null)
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  // Auto-fetch prediction on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchPrediction()
    }
  }, [autoFetch, fetchPrediction])

  // Poll for updates if interval is set
  useEffect(() => {
    if (pollInterval <= 0) return

    const interval = setInterval(() => {
      fetchPrediction()
    }, pollInterval)

    return () => clearInterval(interval)
  }, [pollInterval, fetchPrediction])

  return {
    prediction,
    loading,
    error,
    fetchPrediction,
  }
}
