# Quick Integration Guide - Add to Dashboard

This guide shows how to quickly integrate the new AI Prediction components into your existing Dashboard page.

## 📍 Add to `src/pages/Dashboard.tsx`

### Option A: Add AIPredictor to Your Existing Dashboard

**Step 1:** Import the hook and component

```tsx
import AIPredictor from "@/components/AIPredictor";
import { usePrediction } from "@/hooks/usePrediction";
```

**Step 2:** Add to your component

```tsx
export default function Dashboard() {
  // Existing code...

  // Add this hook (auto-fetches every 10 seconds)
  const { prediction, loading, error } = usePrediction(true, 10000);

  return (
    <div>
      {/* Your existing dashboard content */}

      {/* Add this section for predictions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          AI Energy Predictions
        </h2>
        <AIPredictor data={prediction} loading={loading} error={error} />
      </div>
    </div>
  );
}
```

### Option B: Replace Entire Dashboard with Demo

For testing purposes, replace the entire Dashboard page with the demo:

```tsx
import PredictionDemo from "@/components/PredictionDemo";

export default function Dashboard() {
  return <PredictionDemo />;
}
```

### Option C: Full-Page Dashboard with Predictions (Recommended)

```tsx
import { useState } from "react";
import AIPredictor from "@/components/AIPredictor";
import { usePrediction } from "@/hooks/usePrediction";
// Import your other components
import Navbar from "@/components/Navbar";
import EnergyConsumption from "@/components/EnergyConsumption";

export default function Dashboard() {
  // Fetch predictions with auto-refresh
  const { prediction, loading, error, fetchPrediction } = usePrediction(
    true,
    10000,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2">
            Smart Energy Monitoring & AI Predictions
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Predictions - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="space-y-2 mb-4">
              <h2 className="text-2xl font-bold text-white">AI Predictions</h2>
              <p className="text-slate-400 text-sm">
                Real-time ML analysis of energy usage
              </p>
            </div>
            <AIPredictor data={prediction} loading={loading} error={error} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="rounded-xl border border-slate-400/20 bg-white/5 backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={fetchPrediction}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
                >
                  Refresh Predictions
                </button>
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
                  View History
                </button>
              </div>
            </div>

            {/* Your other widgets here */}
          </div>
        </div>

        {/* Bottom Grid - Other Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Energy Consumption
            </h3>
            <EnergyConsumption voltage={230} current={1.2} />
          </div>

          {/* Add more components here */}
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Common Integration Patterns

### Pattern 1: Grid Layout with Prediction on Left

```tsx
<div className="grid grid-cols-2 gap-6">
  <div>
    <h2 className="text-xl font-bold text-white mb-4">Predictions</h2>
    <AIPredictor data={prediction} loading={loading} error={error} />
  </div>
  <div>
    <h2 className="text-xl font-bold text-white mb-4">Energy Stats</h2>
    {/* Other components */}
  </div>
</div>
```

### Pattern 2: Full Width at Top

```tsx
<div className="space-y-6">
  <div>
    <h2 className="text-2xl font-bold text-white mb-4">AI Predictions</h2>
    <AIPredictor data={prediction} loading={loading} error={error} />
  </div>
  <div className="grid grid-cols-3 gap-6">
    {/* Other components in 3-column grid */}
  </div>
</div>
```

### Pattern 3: Tabbed View

```tsx
import { useState } from "react";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("predictions");
  const { prediction, loading, error } = usePrediction(true, 10000);

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-slate-600">
        <button
          onClick={() => setActiveTab("predictions")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "predictions"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400"
          }`}
        >
          Predictions
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "history"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400"
          }`}
        >
          History
        </button>
      </div>

      {activeTab === "predictions" && (
        <AIPredictor data={prediction} loading={loading} error={error} />
      )}

      {activeTab === "history" && <div>{/* Historical data */}</div>}
    </div>
  );
}
```

## 🔧 Customization Options

### Adjust Auto-Refresh Speed

```tsx
// Fast updates (5 seconds)
usePrediction(true, 5000);

// Medium updates (10 seconds) - RECOMMENDED
usePrediction(true, 10000);

// Slow updates (30 seconds)
usePrediction(true, 30000);

// Manual only
usePrediction(false, 0);
```

### Custom Error Message

```tsx
const { prediction, loading, error } = usePrediction(true, 10000);

return (
  <>
    {error && (
      <div className="mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-lg">
        <p className="text-red-400">⚠️ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm underline"
        >
          Reload Page
        </button>
      </div>
    )}
    <AIPredictor data={prediction} loading={loading} error={error} />
  </>
);
```

### Conditional Rendering

```tsx
export default function Dashboard() {
  const { prediction, loading, error } = usePrediction(true, 10000);
  const userRole = "admin"; // Get from auth context

  return (
    <div>
      {/* Only show predictions to admin users */}
      {userRole === "admin" && (
        <AIPredictor data={prediction} loading={loading} error={error} />
      )}

      {/* Or only show if predictions available */}
      {prediction && (
        <AIPredictor data={prediction} loading={loading} error={error} />
      )}
    </div>
  );
}
```

## 📦 Required Imports

Make sure your Dashboard has these imports:

```tsx
import { useState, useEffect } from "react";
import AIPredictor from "@/components/AIPredictor";
import { usePrediction } from "@/hooks/usePrediction";
```

## ✅ Verification Checklist

After adding to Dashboard, verify:

- [ ] Dashboard loads without errors
- [ ] AIPredictor component renders (shows cards)
- [ ] Auto-refresh is working (data updates on interval)
- [ ] Click "Refresh Now" button works
- [ ] Loading state shows skeleton
- [ ] Error state shows error message (if API down)
- [ ] Responsive on mobile devices
- [ ] Colors match theme

## 🎨 Theme Customization

If you want to match a different color theme, edit in `AIPredictor.tsx`:

```tsx
// Change from blue to cyan for occupancy
const occupancyBgColor =
  data.occupied === 1
    ? "bg-cyan-500/20 border-cyan-400/40" // Changed
    : "bg-purple-500/20 border-purple-400/40";

// Change from green to emerald for normal wastage
const wastageBgColor =
  data.wastage === 1
    ? "bg-red-500/20 border-red-400/40"
    : "bg-emerald-500/20 border-emerald-400/40"; // Changed
```

## 🚀 Deploy Checklist

Before deploying to production:

- [ ] Test with real IoT sensor data
- [ ] Verify backend is calling Flask ML API correctly
- [ ] Check error handling when ML API is unavailable
- [ ] Test on production API endpoint (not localhost)
- [ ] Load test with multiple concurrent users
- [ ] Verify JWT token handling
- [ ] Monitor for memory leaks (long polling)

---

**Ready to integrate?** Pick your preferred pattern above and add it to your Dashboard page!
