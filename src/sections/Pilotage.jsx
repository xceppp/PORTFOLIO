import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { pilotage } from '../content';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion, useTheme } from '../hooks/useTheme';

const BestsellersBookShowcase = lazy(() =>
  import('@designcodeio/threeui/components/BestsellersBookShowcase').then((m) => ({
    default: m.BestsellersBookShowcase,
  })),
);

function syncIframeTheme(root, theme) {
  if (!root) return;
  const iframe = root.querySelector('iframe');
  const doc = iframe?.contentDocument;
  if (!doc?.documentElement) return;

  doc.documentElement.setAttribute('data-theme', theme);
  doc.documentElement.style.colorScheme = theme;

  const scheme = doc.querySelector('meta[name="color-scheme"]');
  if (scheme) scheme.setAttribute('content', theme);

  const themeColor = doc.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute('content', theme === 'light' ? '#f4f5f3' : '#15171a');
  }
}

export default function Pilotage() {
  const reduced = usePrefersReducedMotion();
  const { resolved } = useTheme();
  const stageRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { rootMargin: '480px 0px' });
  const [activated, setActivated] = useState(false);
  const brass = resolved === 'light' ? '#8c6a2e' : '#c29a5b';

  // Mount once near viewport (or shortly after page load) and keep it
  useEffect(() => {
    if (inView) setActivated(true);
  }, [inView]);

  useEffect(() => {
    const id = window.setTimeout(() => setActivated(true), 1800);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const root = stageRef.current;
    if (!root || reduced || !activated) return undefined;

    const apply = () => syncIframeTheme(root, resolved);
    apply();

    const iframe = root.querySelector('iframe');
    iframe?.addEventListener('load', apply);

    // Short burst only — avoid perpetual 400ms polling
    const id = window.setInterval(apply, 500);
    const stop = window.setTimeout(() => window.clearInterval(id), 2500);

    return () => {
      iframe?.removeEventListener('load', apply);
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [resolved, reduced, activated]);

  return (
    <section id={pilotage.id} className="section pilotage" ref={sectionRef}>
      <div className="shell">
        <h2 className="section-title">{pilotage.title}</h2>
        <p className="pilotage__lede">Trois axes de direction institutionnelle</p>
      </div>

      <div
        className="pilotage__stage shader-frame"
        ref={stageRef}
        data-pilotage-theme={resolved}
        data-active={activated && inView ? 'true' : 'false'}
      >
        {reduced || !activated ? (
          <PilotageFallback />
        ) : (
          <Suspense fallback={<div className="pilotage__stage-fallback" aria-hidden="true" />}>
            <BestsellersBookShowcase
              key={resolved}
              headingFont="geist"
              bodyFont="geist"
              headingWeight="600"
              bodyWeight="400"
              primaryColor={brass}
              headingSize={280}
              bodySize={16}
              headingLetterSpacing={-0.04}
            />
          </Suspense>
        )}
      </div>
    </section>
  );
}

function PilotageFallback() {
  return (
    <div className="pilotage__fallback shell">
      {pilotage.tabs.map((axis, i) => (
        <article key={axis.id} className="pilotage__fallback-card">
          <p className="mono">0{i + 1}</p>
          <h3>{axis.label}</h3>
          <ul>
            {(axis.projects || axis.blocks || axis.entries || []).map((item) => (
              <li key={item.name || item.title}>
                <strong>{item.name || item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
