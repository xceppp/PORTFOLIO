import { useEffect, useState } from 'react';

const STORAGE_KEY = 'chalh-theme';

function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function resolveTheme(preference) {
  return preference === 'system' ? getSystemTheme() : preference;
}

export function useTheme() {
  const [preference, setPreference] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch {
      /* ignore */
    }
    return 'dark';
  });

  const [resolved, setResolved] = useState(() => resolveTheme(preference));

  useEffect(() => {
    const next = resolveTheme(preference);
    setResolved(next);
    document.documentElement.setAttribute('data-theme', next);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', next === 'light' ? '#f4f5f3' : '#15171a');
    }

    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      /* ignore */
    }
  }, [preference]);

  useEffect(() => {
    if (preference !== 'system') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      const next = getSystemTheme();
      setResolved(next);
      document.documentElement.setAttribute('data-theme', next);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', next === 'light' ? '#f4f5f3' : '#15171a');
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [preference]);

  return { preference, setPreference, resolved };
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
