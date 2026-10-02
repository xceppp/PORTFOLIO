import { useEffect, useRef, useState } from 'react';
import originalSource from './sources/3d-paper.html?raw';
import { buildArticlePaperDocument } from './buildArticlePaperDocument';
import { useInView } from '../hooks/useInView';

/**
 * Exact ThreeUI ThreeDPaper (original variant), adapted to accept article srcDoc.
 * Source revision SHA-256 8ec1b71c0dbc — canonical 3d-paper.html.
 * Mounts WebGL only while near the viewport to keep page scroll smooth.
 */
export function ThreeDPaper({
  className = '',
  style,
  variant = 'original',
  article = null,
  theme = 'dark',
  srcDoc: srcDocProp,
  active = true,
}) {
  const hostRef = useRef(null);
  const inView = useInView(hostRef, { rootMargin: '180px 0px' });
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  );
  const [ready, setReady] = useState(false);
  const [displayDoc, setDisplayDoc] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const srcDoc =
    srcDocProp ||
    (article
      ? buildArticlePaperDocument(originalSource, article, theme)
      : originalSource);

  // Defer srcDoc swap slightly so rapid carousel ticks don't thrash WebGL
  useEffect(() => {
    if (!active || !inView || !documentVisible) return undefined;
    const id = window.setTimeout(() => {
      setDisplayDoc(srcDoc);
      setReady(false);
    }, 60);
    return () => window.clearTimeout(id);
  }, [srcDoc, active, inView, documentVisible]);

  const mounted = active && inView && documentVisible && Boolean(displayDoc);
  const canvas = theme === 'light' ? '#f4f5f3' : '#15171a';
  const iframeKey = `${theme}-${article?.doi || 'default'}`;

  return (
    <div
      ref={hostRef}
      className={`threeui-background three-d-paper${className ? ` ${className}` : ''}`}
      role="group"
      aria-label="Interactive translucent 3D paper certificate"
      data-state={!mounted ? 'paused' : ready ? 'ready' : 'loading'}
      data-theme={theme}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: canvas,
        pointerEvents: 'auto',
        ...style,
      }}
    >
      {mounted ? (
        <iframe
          key={iframeKey}
          title={article?.title || '3D Paper'}
          srcDoc={displayDoc}
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
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
            pointerEvents: ready ? 'auto' : 'none',
            transition: 'opacity 200ms ease-out',
          }}
        />
      ) : null}
    </div>
  );
}

export default ThreeDPaper;
