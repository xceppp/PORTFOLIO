import { useEffect, useState } from 'react';

/**
 * Mount/run heavy scenes only while near the viewport.
 * rootMargin keeps a small buffer so scenes are ready before they enter.
 */
export function useInView(ref, { rootMargin = '200px 0px', once = false } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref?.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (visible) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
