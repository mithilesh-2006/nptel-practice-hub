import React from 'react';
import { Clock, AlertTriangle, Pause, Play } from 'lucide-react';

interface TimerProps {
  formattedTime: string;
  isLowTime: boolean;
  isCriticalTime: boolean;
  isRunning: boolean;
  onTogglePause?: () => void;
  isCountdown?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  formattedTime,
  isLowTime,
  isCriticalTime,
  isRunning,
  onTogglePause,
  isCountdown = true
}) => {
  return (
    <div
      className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold transition-all ${
        isCriticalTime
          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse'
          : isLowTime
          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
      }`}
    >
      {isCriticalTime ? (
        <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 text-indigo-500" />
      )}

      <span>{formattedTime}</span>

      {onTogglePause && !isCriticalTime && (
        <button
          type="button"
          onClick={onTogglePause}
          className="ml-1 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition"
          title={isRunning ? 'Pause Timer' : 'Resume Timer'}
          aria-label={isRunning ? 'Pause Timer' : 'Resume Timer'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
