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
  const inView = useInView(hostRef, { rootMargin: '220px 0px' });
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  );
  const canvas = theme === 'light' ? '#f4f5f3' : '#15171a';

  const srcDoc =
    srcDocProp ||
    (article
      ? buildArticlePaperDocument(originalSource, article, theme)
      : originalSource);

  const frameKey = `${theme}::${article?.doi || 'default'}`;
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

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

  // Unmount WebGL when far off-screen to free GPU
  useEffect(() => {
    if (live) return undefined;
    const id = window.setTimeout(() => {
      setFront(null);
      setBack(null);
    }, 400);
    return () => window.clearTimeout(id);
  }, [live]);

  const markReady = (key) => {
    setFront((prev) => {
      if (!prev || prev.key !== key) return prev;
      return { ...prev, ready: true };
    });
    // Drop the previous frame after the new one is visible
    window.setTimeout(() => setBack(null), 180);
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
            background: canvas,
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
            background: canvas,
            opacity: front.ready || !back ? 1 : 0,
            pointerEvents: front.ready ? 'auto' : 'none',
            transition: 'opacity 160ms ease-out',
            zIndex: 2,
          }}
        />
      ) : null}
    </div>
  );
}

export default ThreeDPaper;
