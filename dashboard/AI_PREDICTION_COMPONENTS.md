# AI Prediction Components - Complete Guide

## 📋 Overview

Three new React TypeScript components have been created to display AI/ML prediction results in your Smart Energy Dashboard. These components work together to show occupancy status, energy wastage detection, and recommended system actions.

## 🎯 Components Created

### 1. **AIPredictor.tsx** - Main Display Component

The core component that displays prediction results with colored cards.

**Features:**

- ✅ Occupancy status display (Occupied/Empty)
- ✅ Energy wastage detection (Detected/Normal)
- ✅ Recommended action display
- ✅ Colored cards (green for good, red for wastage)
- ✅ Confidence meter with visual progress bar
- ✅ Loading and error states
- ✅ Smooth animations and transitions

**Props:**

```typescript
interface AIPredictorProps {
  data?: PredictionResponse | null; // Prediction data from API
  loading?: boolean; // Show loading skeleton
  error?: string | null; // Show error message
}
```

**Example:**

```tsx
import AIPredictor from "@/components/AIPredictor";

export function MyPage() {
  const prediction = {
    success: true,
    occupied: 1, // 1 = occupied, 0 = empty
    wastage: 1, // 1 = wastage detected, 0 = normal
    action: "Turn OFF Fan",
    confidence: 0.85,
  };

  return <AIPredictor data={prediction} loading={false} error={null} />;
}
```

### 2. **usePrediction.ts** - Data Fetching Hook

Custom React hook to fetch predictions from the backend API with auto-refresh capability.

**Features:**

- ✅ Automatic authentication with JWT token
- ✅ Auto-fetch on component mount
- ✅ Polling/auto-refresh at configurable intervals
- ✅ Error handling
- ✅ Manual fetch function

**Usage:**

```typescript
import { usePrediction } from "@/hooks/usePrediction"

export function MyComponent() {
  // Basic usage
  const { prediction, loading, error, fetchPrediction } = usePrediction()

  // With auto-fetch and 5-second polling
  const { prediction, loading, error } = usePrediction(true, 5000)

  return <AIPredictor data={prediction} loading={loading} error={error} />
}
```

**Hook Parameters:**

- `autoFetch: boolean` - Fetch prediction automatically on mount (default: false)
- `pollInterval: number` - Milliseconds between auto-refreshes (default: 0 = no polling)

**Return Values:**

- `prediction: PredictionData | null` - Current prediction data
- `loading: boolean` - Request in progress
- `error: string | null` - Error message if failed
- `fetchPrediction: () => Promise<void>` - Manual fetch function

### 3. **PredictionDemo.tsx** - Complete Demo Component

A fully functional demo component showing all features in action.

**Features:**

- ✅ Real working example with auto-refresh
- ✅ Configurable refresh interval
- ✅ Manual refresh button
- ✅ Status summary cards
- ✅ How-it-works explanation
- ✅ Development debug info

**Usage:**

```tsx
import PredictionDemo from "@/components/PredictionDemo";

export function Dashboard() {
  return <PredictionDemo />;
}
```

## 🎨 Display States & Colors

### Occupancy Card

| State    | Color  | Icon | Message         |
| -------- | ------ | ---- | --------------- |
| Occupied | Blue   | 👤   | People Detected |
| Empty    | Purple | 🚪   | No Activity     |

### Wastage Card

| State    | Color | Icon | Message           |
| -------- | ----- | ---- | ----------------- |
| Detected | Red   | ⚡   | Energy Leak Found |
| Normal   | Green | ✅   | Efficient         |

### Action Card

| Condition        | Color | Message                                                            |
| ---------------- | ----- | ------------------------------------------------------------------ |
| Wastage Detected | Red   | "Energy wastage detected. System recommends reducing consumption." |
| Normal Operation | Green | "System operating normally. No action needed."                     |

### Confidence Meter

| Level  | Color    | Range  |
| ------ | -------- | ------ |
| High   | Green 🟢 | ≥ 80%  |
| Medium | Amber 🟡 | 60-79% |
| Low    | Red 🔴   | < 60%  |

## 📊 API Response Format

The components expect predictions in this format:

```json
{
  "success": true,
  "occupied": 0,
  "wastage": 1,
  "action": "Turn OFF Fan",
  "confidence": 0.85
}
```

### Field Descriptions

- **success**: boolean - Whether prediction was successful
- **occupied**: 0 | 1 - 1 if room/space is occupied, 0 if empty
- **wastage**: 0 | 1 - 1 if energy wastage detected, 0 if normal
- **action**: string - Recommended action (e.g., "Turn OFF Fan", "Turn ON AC")
- **confidence**: number (0-1) - Model confidence in prediction (optional)

## 🔌 Integration Guide

### Option 1: Simple Direct Usage

```tsx
import AIPredictor from "@/components/AIPredictor";
import { usePrediction } from "@/hooks/usePrediction";

export function Dashboard() {
  const { prediction, loading, error } = usePrediction(true, 10000);

  return <AIPredictor data={prediction} loading={loading} error={error} />;
}
```

### Option 2: Using the Demo Component

```tsx
import PredictionDemo from "@/components/PredictionDemo";

export function Dashboard() {
  return <PredictionDemo />;
}
```

### Option 3: Multiple Predictions in Grid

```tsx
import AIPredictor from "@/components/AIPredictor";
import { usePrediction } from "@/hooks/usePrediction";

export function Dashboard() {
  const pred1 = usePrediction(true, 5000);
  const pred2 = usePrediction(true, 5000);

  return (
    <div className="grid grid-cols-2 gap-6">
      <AIPredictor
        data={pred1.prediction}
        loading={pred1.loading}
        error={pred1.error}
      />
      <AIPredictor
        data={pred2.prediction}
        loading={pred2.loading}
        error={pred2.error}
      />
    </div>
  );
}
```

## 🔄 Data Flow

```
React Component
    ↓
usePrediction Hook (if used)
    ↓
GET /api/sensors/latest (with JWT token)
    ↓
Backend (Node.js)
    ├─ Authenticates user
    ├─ Fetches latest sensor data
    └─ Calls Flask ML API
        ↓
        POST /predict
        ↓
        Flask ML API
        ├─ Loads occupancy model
        ├─ Loads wastage model
        └─ Returns predictions
    ↓
Backend returns combined response
    ↓
usePrediction extracts prediction
    ↓
AIPredictor component displays data
```

## 🛠️ Customization

### Changing Colors

Edit `AIPredictor.tsx` to modify color schemes:

```tsx
// Change occupancy colors
const occupancyBgColor =
  data.occupied === 1
    ? "bg-blue-500/20 border-blue-400/40" // Occupied
    : "bg-purple-500/20 border-purple-400/40"; // Empty

// Change wastage colors
const wastageBgColor =
  data.wastage === 1
    ? "bg-red-500/20 border-red-400/40" // Detected
    : "bg-green-500/20 border-green-400/40"; // Normal
```

### Changing Poll Interval

```tsx
// Update every 5 seconds
usePrediction(true, 5000);

// Update every 30 seconds
usePrediction(true, 30000);

// Update every 1 minute
usePrediction(true, 60000);

// Manual refresh only
usePrediction(false, 0);
```

### Changing Layout

```tsx
// Single column
<div className="space-y-4">
  <AIPredictor data={prediction} />
</div>

// Two columns
<div className="grid grid-cols-2 gap-4">
  <AIPredictor data={prediction1} />
  <AIPredictor data={prediction2} />
</div>

// Three columns
<div className="grid grid-cols-3 gap-4">
  <AIPredictor data={prediction1} />
  <AIPredictor data={prediction2} />
  <AIPredictor data={prediction3} />
</div>
```

## ⚠️ Error Handling

### Common Errors

| Error                                     | Cause                      | Solution                     |
| ----------------------------------------- | -------------------------- | ---------------------------- |
| "Not authenticated. Please log in first." | Missing JWT token          | User needs to log in         |
| "ML API not configured"                   | Backend missing ML_API_URL | Check backend/.env           |
| Connection timeout                        | Flask ML API not running   | Start Flask API on port 8000 |
| API error: Unauthorized                   | JWT token invalid/expired  | Re-login                     |

### Retry Logic

```tsx
export function MyComponent() {
  const { prediction, loading, error, fetchPrediction } = usePrediction();

  return (
    <div>
      {error && (
        <button
          onClick={fetchPrediction}
          className="px-4 py-2 bg-blue-500 rounded"
        >
          Retry
        </button>
      )}
      <AIPredictor data={prediction} loading={loading} error={error} />
    </div>
  );
}
```

## 📱 Responsive Design

All components are mobile-responsive:

```
Desktop (3+ col):  [Predictions] [Predictions] [Other widgets]
Tablet (2 col):    [Predictions] [Predictions]
Mobile (1 col):    [Predictions]
```

## 🚀 Performance Tips

1. **Reduce polling frequency** for non-critical views

   ```tsx
   usePrediction(true, 30000); // Every 30s instead of 5s
   ```

2. **Manual refresh** for dashboards with many components

   ```tsx
   usePrediction(false, 0); // Manual only
   ```

3. **Memoize components** for large dashboards
   ```tsx
   const MemoizedPredictor = React.memo(AIPredictor);
   ```

## 📝 File Locations

```
dashboard/src/
├── components/
│   ├── AIPredictor.tsx           ← Main component
│   ├── AIPredictor.USAGE.md      ← Detailed usage guide
│   ├── PredictionDemo.tsx        ← Complete demo
│   └── (other components...)
├── hooks/
│   ├── usePrediction.ts          ← Data fetching hook
│   └── (other hooks...)
└── (other folders...)
```

## 🧪 Testing

### Manual Test Steps

1. **Start services:**

   ```bash
   # Terminal 1: ML API
   cd ml-api && python app.py

   # Terminal 2: Backend
   cd backend && npm run dev

   # Terminal 3: Frontend
   cd dashboard && npm run dev
   ```

2. **Login to dashboard:**
   - Go to http://localhost:3000
   - Register or login with credentials

3. **View predictions:**
   - Navigate to component using AIPredictor
   - Should see real predictions updating

4. **Test auto-refresh:**
   - Watch for automatic updates
   - Interval should match your pollInterval setting

## 🔗 Related Files

- [Backend ML Integration](../backend/ML_API_INTEGRATION.md)
- [System Architecture](../SYSTEM_ARCHITECTURE.md)
- [ML API Documentation](../ml-api/README.md)
- [API Response Format](../backend/ML_BACKEND_INTEGRATION_SUMMARY.md)

---

**Created:** March 30, 2026  
**Status:** ✅ Ready for Production  
**Last Updated:** March 30, 2026
