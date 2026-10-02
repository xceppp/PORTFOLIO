import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import originalSource from './sources/synthralos-halftone.html?raw';
import { buildTrajectoireKoiDocument } from './buildTrajectoireKoiDocument';
import { useInView } from '../hooks/useInView';
import './threeui.css';

/**
 * Exact ThreeUI KoiStudies (canonical synthralos-halftone).
 * With `stations`, patches card copy + logos for Trajectoire.
 * Logos stay as absolute same-origin URLs (no base64) for smooth load.
 */

const KOI_STUDIES_SOURCE_URL = '/synthralos-halftone.html';

function toAbsoluteLogoUrl(path) {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  try {
    return new URL(path, window.location.origin).href;
  } catch {
    return path;
  }
}

function withAbsoluteLogos(stations) {
  return stations.map((s) => ({ ...s, logo: toAbsoluteLogoUrl(s.logo) }));
}

export function KoiStudies({
  className = '',
  style,
  stations = null,
  theme = 'dark',
  onIndexChange,
  onOpenDetail,
}) {
  const hostRef = useRef(null);
  const frameRef = useRef(null);
  const inView = useInView(hostRef, { rootMargin: '280px 0px', once: true });
  const [ready, setReady] = useState(false);

  const resolvedStations = useMemo(() => {
    if (!stations?.length) return null;
    return withAbsoluteLogos(stations);
  }, [stations]);

  const canvas = resolvedStations?.length
    ? 'transparent'
    : theme === 'light'
      ? '#f4f5f3'
      : '#10100e';

  const srcDoc = useMemo(() => {
    if (!resolvedStations?.length) return null;
    return buildTrajectoireKoiDocument(originalSource, resolvedStations, theme);
  }, [resolvedStations, theme]);

  useEffect(() => {
    setReady(false);
  }, [srcDoc, theme]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const msg = event.data?.koiStudies;
      if (!msg) return;
      if (msg.type === 'index' && onIndexChange) {
        onIndexChange(msg.index, msg.total);
      }
      if (msg.type === 'open' && onOpenDetail) {
        onOpenDetail(msg.index);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onIndexChange, onOpenDetail]);

  const navigate = useCallback((direction) => {
    frameRef.current?.contentWindow?.postMessage(
      { koiStudies: { type: direction === 'prev' ? 'prev' : 'next' } },
      '*',
    );
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    host.__koiNavigate = navigate;
    return () => {
      delete host.__koiNavigate;
    };
  }, [navigate]);

  return (
    <div
      ref={hostRef}
      className={`threeui-background koi-studies${className ? ` ${className}` : ''}`}
      aria-label="Interactive stack of career study cards"
      data-state={!inView ? 'paused' : ready ? 'ready' : 'loading'}
      data-theme={theme}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: canvas,
        pointerEvents: 'auto',
        ...style,
      }}
    >
      {inView ? (
        <iframe
          key={srcDoc ? `${theme}:${resolvedStations?.length}` : `src:${theme}`}
          ref={frameRef}
          title="Koi Studies — Interactive Card Stack"
          srcDoc={srcDoc || undefined}
          src={srcDoc ? undefined : KOI_STUDIES_SOURCE_URL}
          sandbox="allow-scripts allow-same-origin"
          allow="autoplay"
          loading="eager"
          onLoad={() => setReady(true)}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            border: 0,
            background: canvas,
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.45s ease',
          }}
        />
      ) : null}
    </div>
  );
}

export default KoiStudies;
