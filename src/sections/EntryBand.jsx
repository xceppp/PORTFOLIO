import { Suspense, lazy, useEffect, useRef } from 'react';
import { usePrefersReducedMotion, useTheme } from '../hooks/useTheme';

const PredictiveArcCanvas = lazy(() =>
  import('@designcodeio/threeui/components/PredictiveArcCanvas').then((m) => ({
    default: m.PredictiveArcCanvas,
  }))
);

/**
 * Entry band only: top bar → hero → announcement.
 * Halftone Flow (PredictiveArcCanvas) stays inside this block and scrolls away with it.
 */
export default function EntryBand({ children }) {
  const { resolved } = useTheme();
  const reduced = usePrefersReducedMotion();
  const bandRef = useRef(null);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return undefined;

    const sync = () => {
      const bottom = band.getBoundingClientRect().bottom;
      document.documentElement.classList.toggle('entry-band-past', bottom <= 60);
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      document.documentElement.classList.remove('entry-band-past');
    };
  }, []);

  return (
    <div className="entry-band" ref={bandRef}>
      {!reduced && (
        <div className="entry-band__bg" aria-hidden="true">
          <div className="shader-frame entry-band__frame">
            <Suspense fallback={null}>
              <PredictiveArcCanvas
                variant="halftone-flow"
                mode={resolved === 'light' ? 'light' : 'dark'}
                hue={-180}
                saturation={0.0}
                brightness={resolved === 'light' ? 0.72 : 0.9}
              />
            </Suspense>
          </div>
          <div className="entry-band__veil" />
        </div>
      )}
      <div className="entry-band__content">{children}</div>
    </div>
  );
}
