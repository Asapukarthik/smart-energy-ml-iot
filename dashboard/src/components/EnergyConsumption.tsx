import { useMemo } from 'react';

interface EnergyConsumptionProps {
  voltage?: number;
  ledCurrent?: number;
  motorCurrent?: number;
  ledPower?: number;
  motorPower?: number;
  timeHours?: number; // Time in hours for energy calc
}

export default function EnergyConsumption({ 
  voltage = 0, 
  ledCurrent = 0, 
  motorCurrent = 0,
  ledPower,
  motorPower,
  timeHours = 24 
}: EnergyConsumptionProps) {
  // Use hardware power if available, else fallback to calculation
  const totalHardwarePower = (ledPower ?? (voltage * ledCurrent)) + (motorPower ?? (voltage * motorCurrent));
  const currentPowerW = totalHardwarePower;
  // Power (kW)
  const currentPowerKW = currentPowerW / 1000;
  // Energy (kWh)
  const dailyEnergyKWh = currentPowerKW * timeHours;

  const status = useMemo(() => {
    if (currentPowerW < 500) {
      return { 
        label: 'Low Usage', 
        color: 'bg-emerald-500', 
        bg: 'bg-emerald-500/10', 
        text: 'text-emerald-400', 
        progress: Math.min((currentPowerW / 3000) * 100, 100) 
      };
    }
    if (currentPowerW <= 2000) {
      return { 
        label: 'Medium Usage', 
        color: 'bg-amber-400', 
        bg: 'bg-amber-400/10', 
        text: 'text-amber-400', 
        progress: Math.min((currentPowerW / 3000) * 100, 100) 
      };
    }
    return { 
      label: 'High Usage', 
      color: 'bg-rose-500', 
      bg: 'bg-rose-500/10', 
      text: 'text-rose-400', 
      progress: Math.min((currentPowerW / 3000) * 100, 100) 
    };
  }, [currentPowerW]);

  // Handle progress bar nicely even if 0
  const progressPercent = currentPowerW === 0 ? 0 : Math.max(status.progress, 2);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm dark:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Energy Monitor</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time calculations</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold border ${status.text} ${status.bg} border-current/20 shadow-sm`}>
          {status.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-white/5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60 shadow-sm dark:shadow-none">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Current Power</p>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
              {currentPowerW.toFixed(0)}
            </span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 mb-0.5">W</span>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-white/5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60 shadow-sm dark:shadow-none">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Est. Daily (24h)</p>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
              {dailyEnergyKWh.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 mb-0.5">kWh</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center text-xs font-semibold mb-2">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wide">Capacity Load</span>
          <span className="text-slate-900 dark:text-white tabula-lining">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner relative">
          <div 
            className={`h-full ${status.color} transition-all duration-700 ease-out relative overflow-hidden`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer effect for progress bar */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2.5 text-[10px] font-medium text-slate-500">
          <span>0W</span>
          <span>1.5kW</span>
          <span>3kW+</span>
        </div>
      </div>
    </div>
  );
}
