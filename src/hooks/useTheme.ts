import { useState, useEffect } from 'react';
import { useProgress } from './useProgress';

export function useTheme() {
  const { preferences, updatePreferences } = useProgress();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const pref = preferences.theme || 'system';

    let isDark = false;
    if (pref === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = pref === 'dark';
    }

    if (isDark) {
      root.classList.add('dark');
      setResolvedTheme('dark');
    } else {
      root.classList.remove('dark');
      setResolvedTheme('light');
    }

    const listener = (e: MediaQueryListEvent) => {
      if (preferences.theme === 'system') {
        if (e.matches) {
          root.classList.add('dark');
          setResolvedTheme('dark');
        } else {
          root.classList.remove('dark');
          setResolvedTheme('light');
        }
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [preferences.theme]);

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    updatePreferences({ theme: nextTheme });
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    updatePreferences({ theme: mode });
  };

  return {
    themeSetting: preferences.theme || 'system',
    resolvedTheme,
    toggleTheme,
    setThemeMode
  };
}
