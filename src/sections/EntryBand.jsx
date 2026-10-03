import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion, useTheme } from '../hooks/useTheme';

// Start fetching the Halftone chunk as soon as this module loads (not after paint).
const predictiveArcImport = import('@designcodeio/threeui/components/PredictiveArcCanvas').then(
  (m) => ({ default: m.PredictiveArcCanvas }),
);
const PredictiveArcCanvas = lazy(() => predictiveArcImport);

/**
 * Entry band only: top bar → hero → announcement.
 * Halftone Flow stays inside this block and unmounts once scrolled past.
 */
export default function EntryBand({ children }) {
  const { resolved } = useTheme();
  const reduced = usePrefersReducedMotion();
  const bandRef = useRef(null);
  const [past, setPast] = useState(false);
  const [shaderReady, setShaderReady] = useState(false);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return undefined;

    let ticking = false;
    const sync = () => {
      // Past the hero name plane → allow “Zakaria CHALH” back in the bar
      const hero = document.getElementById('accueil');
      const marker = hero || band;
      const nextPast = marker.getBoundingClientRect().bottom <= 72;
      setPast(nextPast);
      document.documentElement.classList.toggle('entry-band-past', nextPast);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.documentElement.classList.remove('entry-band-past');
    };
  }, []);

  // Resolve chunk ASAP so Suspense doesn't sit empty after first paint
  useEffect(() => {
    let alive = true;
    predictiveArcImport.then(() => {
      if (alive) setShaderReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const showShader = !reduced && !past;

  return (
    <div className="entry-band" ref={bandRef} data-shader={shaderReady && showShader ? 'ready' : 'pending'}>
      <div className="entry-band__bg" aria-hidden="true">
        {/* Instant atmosphere — visible before WebGL mounts */}
        <div className="entry-band__atmosphere" />
        {showShader && (
          <div className="shader-frame entry-band__frame" data-ready={shaderReady ? 'true' : 'false'}>
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
        )}
        <div className="entry-band__veil" />
      </div>
      <div className="entry-band__content">{children}</div>
    </div>
  );
}
