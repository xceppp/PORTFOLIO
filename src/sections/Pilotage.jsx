import { useId, useState } from 'react';
import { pilotage } from '../content';

function axisItems(axis) {
  if (axis.projects) {
    return axis.projects.map((p) => ({
      title: p.name,
      meta: p.category,
      body: p.body,
      featured: p.featured,
    }));
  }
  if (axis.blocks) {
    return axis.blocks.map((b) => ({
      title: b.title,
      meta: null,
      body: b.body,
      featured: false,
    }));
  }
  return (axis.entries || []).map((e) => ({
    title: e.title,
    meta: e.years,
    body: e.body,
    featured: false,
  }));
}

export default function Pilotage() {
  const [tab, setTab] = useState(0);
  const baseId = useId();
  const current = pilotage.tabs[tab];
  const items = axisItems(current);

  return (
    <section id={pilotage.id} className="section pilotage">
      <div className="shell">
        <h2 className="section-title">{pilotage.title}</h2>
        <p className="pilotage__lede">Trois axes de direction institutionnelle</p>

        <div className="pilot-layout">
          <div
            className="pilot-layout__tabs"
            role="tablist"
            aria-label="Axes de pilotage"
          >
            {pilotage.tabs.map((axis, i) => (
              <button
                key={axis.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${axis.id}`}
                aria-selected={tab === i}
                aria-controls={`${baseId}-panel-${axis.id}`}
                tabIndex={tab === i ? 0 : -1}
                className={`pilot-layout__tab ${tab === i ? 'is-on' : ''}`}
                onClick={() => setTab(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    setTab((t) => (t + 1) % pilotage.tabs.length);
                  }
                  if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    setTab((t) => (t - 1 + pilotage.tabs.length) % pilotage.tabs.length);
                  }
                }}
              >
                <span className="mono">0{i + 1}</span>
                <span>{axis.label}</span>
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel-${current.id}`}
            aria-labelledby={`${baseId}-tab-${current.id}`}
            className="pilot-layout__panel"
            key={current.id}
          >
            <h3>{current.label}</h3>
            <ul className="pilot-layout__items">
              {items.map((item) => (
                <li
                  key={item.title}
                  className={`pilot-layout__item ${item.featured ? 'is-featured' : ''}`}
                >
                  {item.meta && <span className="pilot-layout__meta">{item.meta}</span>}
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
