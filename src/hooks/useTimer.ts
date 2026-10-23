import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  durationSeconds: number; // 0 for count up (stopwatch)
  autoStart?: boolean;
  onExpire?: () => void;
}

export function useTimer({ durationSeconds, autoStart = true, onExpire }: UseTimerOptions) {
  const isCountdown = durationSeconds > 0;
  const [timeLeft, setTimeLeft] = useState<number>(isCountdown ? durationSeconds : 0);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [hasExpired, setHasExpired] = useState<boolean>(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setTimeLeft(isCountdown ? durationSeconds : 0);
    setHasExpired(false);
  }, [durationSeconds, isCountdown]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (isCountdown) {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            setHasExpired(true);
            if (onExpireRef.current) {
              onExpireRef.current();
            }
            return 0;
          }
          return prev - 1;
        } else {
          return prev + 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isCountdown]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);
  const reset = useCallback(() => {
    setTimeLeft(isCountdown ? durationSeconds : 0);
    setIsRunning(false);
    setHasExpired(false);
  }, [durationSeconds, isCountdown]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${pad(hrs)}:${pad(remMins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const isLowTime = isCountdown && timeLeft <= 120 && timeLeft > 0; // less than 2 min
  const isCriticalTime = isCountdown && timeLeft <= 30 && timeLeft > 0; // less than 30s
  const percentRemaining = isCountdown && durationSeconds > 0
    ? Math.max(0, Math.min(100, (timeLeft / durationSeconds) * 100))
    : 100;

  return {
    timeLeft,
    timeSpent: isCountdown ? durationSeconds - timeLeft : timeLeft,
    formattedTime: formatTime(timeLeft),
    isRunning,
    hasExpired,
    isLowTime,
    isCriticalTime,
    percentRemaining,
    pause,
    resume,
    reset,
    formatTime
  };
}
