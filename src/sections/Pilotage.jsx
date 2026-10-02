import { useEffect, useRef, useState } from 'react';
import { pilotage } from '../content';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion, useTheme } from '../hooks/useTheme';

const PILOTAGE_BOOKS_URL = '/landing-pages/bestsellers-book-showcase.html?v=open-click-v4';

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
  const frameRef = useRef(null);
  const inView = useInView(sectionRef, { rootMargin: '480px 0px' });
  const [activated, setActivated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (inView) setActivated(true);
  }, [inView]);

  useEffect(() => {
    setReady(false);
  }, [resolved]);

  useEffect(() => {
    const root = stageRef.current;
    if (!root || reduced || !activated) return undefined;

    const apply = () => syncIframeTheme(root, resolved);
    apply();

    const iframe = frameRef.current || root.querySelector('iframe');
    iframe?.addEventListener('load', apply);

    const id = window.setInterval(apply, 500);
    const stop = window.setTimeout(() => window.clearInterval(id), 2500);

    return () => {
      iframe?.removeEventListener('load', apply);
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [resolved, reduced, activated, ready]);

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
          <div
            className="threeui-background landing-page-frame"
            data-state={ready ? 'ready' : 'loading'}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              background: 'transparent',
              pointerEvents: 'auto',
            }}
          >
            <iframe
              key={`${resolved}:open-click-v4`}
              ref={frameRef}
              title="Pilotage — Trois axes de direction"
              src={`${PILOTAGE_BOOKS_URL}&theme=${resolved}`}
              sandbox="allow-scripts allow-same-origin"
              loading="eager"
              onLoad={() => {
                setReady(true);
                syncIframeTheme(stageRef.current, resolved);
              }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'block',
                width: '100%',
                height: '100%',
                border: 0,
                background: 'transparent',
              }}
            />
          </div>
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
