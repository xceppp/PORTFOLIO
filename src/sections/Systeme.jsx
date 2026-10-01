import { useCallback, useEffect, useId, useRef, useState } from 'react';
import DecodeOnView from '../bits/DecodeOnView';
import { usePrefersReducedMotion } from '../hooks/useTheme';
import { systeme } from '../content';

const LOOP_PATH =
  'M70 48 H250 Q290 48 290 78 V102 Q290 132 250 132 H70 Q30 132 30 102 V78 Q30 48 70 48';

const NODE_POS = [
  { label: 'COMMANDE', x: 95, y: 40, tab: 0 },
  { label: 'SYSTÈME', x: 225, y: 40, tab: 1 },
  { label: 'MESURE', x: 225, y: 140, tab: 2 },
  { label: 'RETOUR', x: 95, y: 140, tab: 2 },
];

const CYCLE_MS = 9000;

function nearestNode(x, y) {
  let best = NODE_POS[0];
  let bestDist = Infinity;
  for (const node of NODE_POS) {
    const d = (node.x - x) ** 2 + (node.y - y) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = node;
    }
  }
  return bestDist < 36 ** 2 ? best : null;
}

function ControlLoop({
  highlights,
  assembling,
  pulse,
  activeNode,
  onNodeHit,
  onNodeClick,
}) {
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const lastHit = useRef('');

  useEffect(() => {
    if (!pulse || !pathRef.current || !dotRef.current) return undefined;

    const path = pathRef.current;
    const dot = dotRef.current;
    const len = path.getTotalLength();
    let raf = 0;
    const start = performance.now();

    const tick = (now) => {
      const t = ((now - start) % CYCLE_MS) / CYCLE_MS;
      const pt = path.getPointAtLength(t * len);
      dot.setAttribute('cx', String(pt.x));
      dot.setAttribute('cy', String(pt.y));

      const hit = nearestNode(pt.x, pt.y);
      if (hit && hit.label !== lastHit.current) {
        lastHit.current = hit.label;
        onNodeHit?.(hit);
      }
      if (!hit) {
        lastHit.current = '';
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pulse, onNodeHit]);

  return (
    <svg
      className={`control-loop ${assembling ? 'is-assembling' : ''} ${pulse ? 'is-pulsing' : ''}`}
      viewBox="0 0 320 180"
      role="img"
      aria-label="Boucle de commande"
    >
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" />
        </marker>
      </defs>

      <rect x="1" y="1" width="318" height="178" className="control-loop__frame" />

      <path d={LOOP_PATH} className="control-loop__path control-loop__path--ghost" fill="none" />
      <path
        ref={pathRef}
        d={LOOP_PATH}
        className="control-loop__path control-loop__path--draw"
        fill="none"
        markerMid="url(#arrow)"
        pathLength={1}
      />

      {NODE_POS.map((node, i) => {
        const on = highlights.includes(node.label) || activeNode === node.label;
        return (
          <g
            key={node.label}
            className={`control-loop__node ${on ? 'is-on' : ''} node-${node.label.toLowerCase()}`}
            style={{ '--node-i': i, cursor: 'pointer' }}
            onClick={() => onNodeClick?.(node)}
            role="button"
            tabIndex={0}
            aria-label={node.label}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNodeClick?.(node);
              }
            }}
          >
            <rect x={node.x - 42} y={node.y - 12} width="84" height="24" rx="2" />
            <text x={node.x} y={node.y + 4} textAnchor="middle">
              {node.label}
            </text>
          </g>
        );
      })}

      <text x="160" y="96" textAnchor="middle" className="control-loop__anno">
        {systeme.annotations}
      </text>

      <circle
        ref={dotRef}
        r="4.5"
        className="control-loop__pulse"
        cx={NODE_POS[0].x}
        cy={NODE_POS[0].y}
      />
    </svg>
  );
}

export default function Systeme() {
  const [tab, setTab] = useState(0);
  const [activeNode, setActiveNode] = useState('COMMANDE');
  const baseId = useId();
  const reduced = usePrefersReducedMotion();
  const current = systeme.tabs[tab];
  const sectionRef = useRef(null);
  const [live, setLive] = useState(false);
  const [schemaReady, setSchemaReady] = useState(false);
  const [pulse, setPulse] = useState(false);

  const applyNode = useCallback((node) => {
    setActiveNode(node.label);
    setTab(node.tab);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    if (reduced) {
      setLive(true);
      setSchemaReady(true);
      setPulse(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLive(true);
        window.setTimeout(() => setSchemaReady(true), 280);
        window.setTimeout(() => setPulse(true), 2100);
        observer.disconnect();
      },
      { threshold: 0.28 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id={systeme.id}
      className={`section systeme ${live ? 'is-live' : ''} ${schemaReady ? 'is-built' : ''}`}
    >
      <div className="shell blueprint-section">
        <div className="systeme__copy">
          <DecodeOnView
            text={systeme.title}
            className="section-title systeme__title"
            as="h2"
            delay={0}
          />
          <DecodeOnView
            text={systeme.sentence}
            className="lede systeme__lede"
            as="p"
            delay={220}
          />
        </div>

        <div className="systeme__layout">
          <div className="systeme__visual">
            <div className="systeme__schematic-shell">
              <ControlLoop
                highlights={current.highlights}
                assembling={schemaReady}
                pulse={!reduced && pulse}
                activeNode={activeNode}
                onNodeHit={applyNode}
                onNodeClick={applyNode}
              />
              <p className="systeme__build-label mono" aria-hidden="true">
                {activeNode
                  ? `point · ${activeNode}`
                  : pulse
                    ? 'boucle active'
                    : schemaReady
                      ? 'assemblage…'
                      : 'en attente'}
              </p>
            </div>
          </div>

          <div className="systeme__detail">
            <div className="tabs systeme__tabs" role="tablist" aria-label="Axes de recherche">
              {systeme.tabs.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={tab === i}
                  aria-controls={`${baseId}-panel-${item.id}`}
                  tabIndex={tab === i ? 0 : -1}
                  className={`tabs__btn ${tab === i ? 'is-active' : ''}`}
                  onClick={() => {
                    setTab(i);
                    const node = NODE_POS.find((n) => n.tab === i);
                    if (node) setActiveNode(node.label);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      setTab((t) => (t + 1) % systeme.tabs.length);
                    }
                    if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      setTab((t) => (t - 1 + systeme.tabs.length) % systeme.tabs.length);
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
              <span
                className="tabs__marker"
                style={{
                  width: `${100 / systeme.tabs.length}%`,
                  transform: `translateX(${tab * 100}%)`,
                }}
                aria-hidden="true"
              />
            </div>

            <div
              role="tabpanel"
              id={`${baseId}-panel-${current.id}`}
              aria-labelledby={`${baseId}-tab-${current.id}`}
              className="systeme__panel systeme__panel--live"
              key={current.id + activeNode}
            >
              <p className="systeme__panel-node mono">{activeNode}</p>
              <h3>{current.axis}</h3>
              <p>{current.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
