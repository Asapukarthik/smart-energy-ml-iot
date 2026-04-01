import { Line } from "react-chartjs-2"
import { useTheme } from "../context/ThemeContext"
import type { SensorData } from "../types/sensor"

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

type MetricKey = "temperature" | "voltage" | "ledCurrent" | "motorCurrent" | "occupancy" | "humidity"

interface Props {
    data: SensorData[]
    metric?: MetricKey
    title?: string
}

export default function ChartView({ data, metric, title }: Props) {
    const { isDarkMode } = useTheme();
    const labels = data.map(d => new Date(d.timestamp).toLocaleTimeString()).reverse()

    const metricLabel = title ?? (metric ? metric.charAt(0).toUpperCase() + metric.slice(1) : "System Metrics")

    const dataset = metric
        ? [
              {
                  label: metricLabel,
                  data: data.map(d => d[metric]).reverse(),
                  borderColor:
                      metric === "temperature"
                          ? "#ef4444" // red-500
                          : metric === "voltage"
                          ? "#3b82f6" // blue-500
                          : metric === "ledCurrent"
                          ? "#10b981" // emerald-500
                          : metric === "motorCurrent"
                          ? "#f59e0b" // amber-500
                          : metric === "humidity"
                          ? "#0ea5e9" // sky-500
                          : "#8b5cf6", // violet-500
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  tension: 0.4,
                  pointRadius: 2,
              },
          ]
        : [
              {
                  label: "Temp",
                  data: data.map(d => d.temperature).reverse(),
                  borderColor: "#ef4444",
                  tension: 0.4,
                  pointRadius: 0,
              },
              {
                  label: "Volt",
                  data: data.map(d => d.voltage).reverse(),
                  borderColor: "#3b82f6",
                  tension: 0.4,
                  pointRadius: 0,
              },
              {
                  label: "Curr (LED)",
                  data: data.map(d => d.ledCurrent ?? 0).reverse(),
                  borderColor: "#10b981",
                  tension: 0.4,
                  pointRadius: 0,
              },
              {
                  label: "Curr (Motor)",
                  data: data.map(d => d.motorCurrent ?? 0).reverse(),
                  borderColor: "#f59e0b",
                  tension: 0.4,
                  pointRadius: 0,
              },
          ]

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: isDarkMode ? "#94a3b8" : "#475569", // slate-400 : slate-600
                    font: { size: 10, weight: 'bold' as const }
                }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: isDarkMode ? "#64748b" : "#94a3b8", // slate-500 : slate-400
                    font: { size: 9 },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6
                }
            },
            y: {
                grid: {
                    color: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                    drawBorder: false
                },
                ticks: {
                    color: isDarkMode ? "#64748b" : "#94a3b8",
                    font: { size: 9 }
                }
            }
        }
    }

    return (
        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{metricLabel} History</h2>
                <div className="flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Live Stream</span>
                </div>
            </div>
            <div className="h-64">
                <Line data={{ labels, datasets: dataset }} options={chartOptions} />
            </div>
        </div>
    )
}
