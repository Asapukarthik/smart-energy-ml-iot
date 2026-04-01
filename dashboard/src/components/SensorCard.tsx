type MetricVariant = "temperature" | "voltage" | "current" | "motion"

interface Props {

    title: string
    value: number | string
    unit?: string
    variant?: MetricVariant

}

const variantStyles: Record<MetricVariant, string> = {
    temperature: "border-red-400/40 bg-white dark:bg-white/10",
    voltage: "border-blue-400/40 bg-white dark:bg-white/10",
    current: "border-emerald-400/40 bg-white dark:bg-white/10",
    motion: "border-violet-400/40 bg-white dark:bg-white/10",
}

export default function SensorCard({ title, value, unit, variant = "temperature" }: Props) {
    // Format numeric values to 1 decimal place, handle strings (like motion) as is
    const displayValue = typeof value === "number" 
        ? value.toFixed(1) 
        : value === "Detected" ? "Active" : "No Activity"

    return (
        <div className={`rounded-xl border p-6 shadow-sm dark:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/5 ${variantStyles[variant]}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {title}
            </h3>
            <p className="mt-4 text-4xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                <span className="font-mono tabular-nums leading-none tracking-tight">
                    {displayValue}
                </span>
                {unit && (
                    <span className="text-lg font-medium text-slate-400 dark:text-slate-500">
                        {unit}
                    </span>
                )}
            </p>
        </div>
    )
}