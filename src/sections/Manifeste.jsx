import { manifeste } from '../content';

export default function Manifeste() {
  return (
    <section id={manifeste.id} className="section manifeste">
      <div className="shell blueprint-section">
        <div className="manifeste__grid">
          <figure className="manifeste__portrait">
            <img
              src={manifeste.portrait}
              alt={manifeste.portraitAlt}
              width={480}
              height={600}
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.dataset.fallback === '1') return;
                e.currentTarget.dataset.fallback = '1';
                e.currentTarget.src = manifeste.portraitFallback;
              }}
            />
          </figure>

          <div className="manifeste__copy">
            <div className="manifeste__prose">
              <p className="manifeste__lead">« {manifeste.quote} »</p>
              <p>{manifeste.bio}</p>
              <p>{manifeste.positioning}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
