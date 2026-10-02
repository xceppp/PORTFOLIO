import { useEffect, useRef, useState } from 'react';
import originalSource from './sources/3d-paper.html?raw';
import { buildArticlePaperDocument } from './buildArticlePaperDocument';
import { useInView } from '../hooks/useInView';

/**
 * Exact ThreeUI ThreeDPaper (original variant), adapted to accept article srcDoc.
 * Double-buffers iframe swaps so article changes don't flash a blank plate.
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
  // once: true — latch visibility so scroll jitter doesn't tear down WebGL
  const inView = useInView(hostRef, { rootMargin: '480px 0px', once: true });
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  );
  const canvas = 'transparent';

  const srcDoc =
    srcDocProp ||
    (article
      ? buildArticlePaperDocument(originalSource, article, theme)
      : originalSource);

  // Include a build stamp so theme/srcDoc patches remount after HMR
  const frameKey = `${theme}::${article?.doi || 'default'}::v9`;
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  // Parent `active` (Production activated) keeps the scene mounted after first sight
  const live = active && inView && documentVisible;

  useEffect(() => {
    if (!live) return undefined;

    // Already showing this article/theme
    if (front?.key === frameKey && front.srcDoc === srcDoc) return undefined;

    const id = window.setTimeout(() => {
      setBack(front && front.ready ? front : null);
      setFront({
        key: frameKey,
        srcDoc,
        title: article?.title || '3D Paper',
        ready: false,
      });
    }, 40);

    return () => window.clearTimeout(id);
  }, [live, frameKey, srcDoc, article?.title, front]);

  // Tear down sooner when off-screen / hidden to free the RAF loop
  useEffect(() => {
    if (live) return undefined;
    if (active && inView) return undefined;
    const id = window.setTimeout(() => {
      setFront(null);
      setBack(null);
    }, 600);
    return () => window.clearTimeout(id);
  }, [live, active, inView]);

  const markReady = (key) => {
    setFront((prev) => {
      if (!prev || prev.key !== key) return prev;
      return { ...prev, ready: true };
    });
    // Keep previous paper up until the new one has faded in
    window.setTimeout(() => setBack(null), 420);
  };

  return (
    <div
      ref={hostRef}
      className={`threeui-background three-d-paper${className ? ` ${className}` : ''}`}
      role="group"
      aria-label="Interactive translucent 3D paper certificate"
      data-state={!live || !front ? 'paused' : front.ready ? 'ready' : 'loading'}
      data-theme={theme}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: canvas,
        isolation: 'auto',
        pointerEvents: 'auto',
        ...style,
      }}
    >
      {back ? (
        <iframe
          key={`back-${back.key}`}
          title=""
          aria-hidden="true"
          srcDoc={back.srcDoc}
          sandbox="allow-scripts allow-same-origin"
          tabIndex={-1}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            border: 0,
            background: 'transparent',
            colorScheme: theme === 'light' ? 'light' : 'dark',
            opacity: 1,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ) : null}

      {front ? (
        <iframe
          key={`front-${front.key}`}
          title={front.title}
          srcDoc={front.srcDoc}
          sandbox="allow-scripts allow-same-origin"
          loading="eager"
          onLoad={() => markReady(front.key)}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            border: 0,
            background: 'transparent',
            colorScheme: theme === 'light' ? 'light' : 'dark',
            opacity: front.ready || !back ? 1 : 0,
            pointerEvents: front.ready ? 'auto' : 'none',
            transition: 'opacity 320ms ease',
            zIndex: 2,
          }}
        />
      ) : null}
    </div>
  );
}

export default ThreeDPaper;
