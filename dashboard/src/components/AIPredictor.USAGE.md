/\*\*

- AI PREDICTOR COMPONENT - USAGE GUIDE
-
- This guide demonstrates how to use the AIPredictor component
- And the usePrediction hook to display ML predictions in your React app
  \*/

// ============================================
// BASIC USAGE - Standalone Component
// ============================================

import AIPredictor from "@/components/AIPredictor"

export function BasicExample() {
const mockPrediction = {
success: true,
occupied: 1, // 1 = occupied, 0 = empty
wastage: 1, // 1 = wastage detected, 0 = normal
action: "Turn OFF Fan",
confidence: 0.85,
}

return (
<div className="p-6">
<AIPredictor data={mockPrediction} loading={false} error={null} />
</div>
)
}

// ============================================
// ADVANCED USAGE - With usePrediction Hook
// ============================================

import { usePrediction } from "@/hooks/usePrediction"
import { useEffect } from "react"

export function AdvancedExample() {
// Auto-fetch prediction on mount, poll every 5 seconds
const { prediction, loading, error, fetchPrediction } = usePrediction(
true, // autoFetch: true - fetch immediately on mount
5000 // pollInterval: 5000ms - refresh every 5 seconds
)

return (
<div className="p-6 space-y-4">
<div className="flex items-center justify-between">
<h1 className="text-2xl font-bold text-white">Live Energy Predictions</h1>
<button
          onClick={fetchPrediction}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-grey-500 text-white rounded-lg font-semibold transition"
        >
{loading ? "Loading..." : "Refresh"}
</button>
</div>

      <AIPredictor data={prediction} loading={loading} error={error} />
    </div>

)
}

// ============================================
// DASHBOARD INTEGRATION - Multiple Predictions
// ============================================

import Dashboard from "@/pages/Dashboard"

export function DashboardIntegrationExample() {
// First prediction (top-left area)
const { prediction: currentPrediction, loading: currentLoading } = usePrediction(
true,
10000 // Update every 10 seconds
)

// Second prediction (bottom-right area)
const { prediction: historicalPrediction } = usePrediction(false) // Manual fetch only

return (
<div className="grid grid-cols-2 gap-6 p-6">
<div>
<h2 className="text-lg font-bold text-white mb-4">Current Prediction</h2>
<AIPredictor data={currentPrediction} loading={currentLoading} error={null} />
</div>

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Previous Prediction</h2>
        <AIPredictor data={historicalPrediction} loading={false} error={null} />
      </div>
    </div>

)
}

// ============================================
// WITH ERROR HANDLING
// ============================================

export function ErrorHandlingExample() {
const { prediction, loading, error, fetchPrediction } = usePrediction(true, 5000)

return (
<div className="p-6">
{error && (
<div className="mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-lg">
<p className="text-red-400 font-semibold">Error: {error}</p>
<button
            onClick={fetchPrediction}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
          >
Retry
</button>
</div>
)}

      <AIPredictor data={prediction} loading={loading} error={error} />
    </div>

)
}

// ============================================
// API RESPONSE FORMAT
// ============================================

/\*\*

- Expected response from backend when fetching latest sensor data:
-
- {
- "success": true,
- "count": 1,
- "data": [
-     {
-       "sensor": {
-         "_id": "...",
-         "motion": 0,
-         "temperature": 28,
-         "current": 1.2,
-         "voltage": 230,
-         "lightStatus": false,
-         "fanStatus": false,
-         "timestamp": "2026-03-30T10:30:00.000Z"
-       },
-       "prediction": {
-         "success": true,
-         "occupied": 0,
-         "wastage": 1,
-         "action": "Turn OFF Fan",
-         "confidence": 0.85
-       }
-     }
- ]
- }
  \*/

// ============================================
// COMPONENT PROPS
// ============================================

/\*\*

- AIPredictor Component Props:
-
- @interface AIPredictorProps {
- data?: PredictionResponse | null
-     - The prediction data to display
-     - Required shape: { success, occupied, wastage, action, confidence? }
-     - occupancy: 0 = empty, 1 = occupied
-     - wastage: 0 = normal, 1 = detected
-     - action: string describing the recommended action (e.g., "Turn OFF Fan")
-     - confidence: number 0-1 representing model confidence
-
- loading?: boolean (default: false)
-     - Shows loading skeleton while fetching data
-
- error?: string | null (default: null)
-     - Shows error message if prediction failed
- }
  \*/

// ============================================
// HOOK OPTIONS
// ============================================

/\*\*

- usePrediction Hook Options:
-
- @param autoFetch: boolean
- - true: Automatically fetch prediction on component mount
- - false: Manual fetch only (user must call fetchPrediction())
- - Default: false
-
- @param pollInterval: number (milliseconds)
- - 0 or negative: No polling, single fetch
- - 5000: Refresh every 5 seconds
- - 10000: Refresh every 10 seconds
- - Default: 0
-
- @returns {
- prediction: PredictionData | null - The current prediction
- loading: boolean - Is request in progress
- error: string | null - Error message if failed
- fetchPrediction: () => Promise<void> - Manual fetch function
- }
  \*/

// ============================================
// DISPLAY COLORS & STATES
// ============================================

/\*\*

- Color States:
-
- OCCUPANCY:
- - occupied (1): Blue background, "👤" icon, "People Detected"
- - empty (0): Purple background, "🚪" icon, "No Activity"
-
- WASTAGE:
- - detected (1): Red background, "⚡" icon, "Energy Leak Found"
- - normal (0): Green background, "✅" icon, "Efficient"
-
- ACTION CARD:
- - If wastage: Red background, warning message
- - If normal: Green background, normal message
-
- CONFIDENCE:
- - > = 80%: Green bar
- - 60-79%: Amber bar
- - < 60%: Red bar
    \*/

// ============================================
// EXAMPLE: INTEGRATING INTO DASHBOARD PAGE
// ============================================

import { usePrediction } from "@/hooks/usePrediction"

export function DashboardPage() {
// Fetch prediction with auto-refresh every 10 seconds
const { prediction, loading, error } = usePrediction(true, 10000)

return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
<div className="max-w-7xl mx-auto">
{/_ Header _/}
<h1 className="text-4xl font-bold text-white mb-8">Smart Energy Monitor</h1>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Predictions - Takes 2 columns */}
          <div className="lg:col-span-2">
            <AIPredictor data={prediction} loading={loading} error={error} />
          </div>

          {/* Other Dashboard Components */}
          <div className="space-y-4">
            {/* Additional widgets */}
          </div>
        </div>
      </div>
    </div>

)
}

// ============================================
// IMPORTANT NOTES
// ============================================

/\*\*

- 1.  AUTHENTICATION:
- - usePrediction automatically checks for JWT token in localStorage
- - User must be logged in for predictions to work
- - Token key: "smart-energy-dashboard-token"
-
- 2.  API FLOW:
- - Frontend calls backend: GET /api/sensors/latest
- - Backend calls Flask ML API: POST http://localhost:8000/predict
- - Backend returns combined result with prediction
- - Hook extracts prediction from response
-
- 3.  ERROR SCENARIOS:
- - "Not authenticated": User not logged in
- - "ML API not configured": Backend.env missing ML_API_URL
- - Connection errors: Flask ML API not running on port 8000
-
- 4.  STYLING:
- - Uses Tailwind CSS with dark theme colors
- - Responsive grid layout (2 columns on card container)
- - Smooth transitions and animations
- - Glassmorphic backdrop effects
-
- 5.  PERFORMANCE:
- - Poll interval minimum recommended: 5000ms (5 seconds)
- - Reduce load by increasing interval for less critical views
- - Manual fetchPrediction() for on-demand updates
    \*/
