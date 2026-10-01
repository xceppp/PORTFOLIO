import { lazy, useEffect, useState } from "react";
import BlurText from "./bits/BlurText";
import DecryptedText from "./bits/DecryptedText";
import CountUp from "./bits/CountUp";
import ScrollVelocity from "./bits/ScrollVelocity";
import Reveal from "./Reveal";
import SceneMount from "./SceneMount";
import useIsMobile from "./useIsMobile";
import "./styles.css";

const StructureFlowCollection = lazy(() =>
  import("@designcodeio/threeui/components/StructureFlowCollection").then((m) => ({
    default: m.StructureFlowCollection,
  }))
);
const ThreeDPaper = lazy(() =>
  import("./threeui-src/shaders/3d-paper/ThreeDPaper.jsx").then((m) => ({ default: m.ThreeDPaper }))
);
const AshenPress = lazy(() =>
  import("./threeui-src/shaders/ashen-press/AshenPress.jsx").then((m) => ({ default: m.AshenPress }))
);
const BookshelfScene = lazy(() =>
  import("./threeui-src/shaders/bookshelf/BookshelfScene.js").then((m) => ({
    default: m.BookshelfScene,
  }))
);

const stations = [
  { when: "DEPUIS 2026", title: "Directeur de l’EST de Meknès", text: "Université Moulay Ismaïl — direction académique, administrative et transformation numérique." },
  { when: "2020 — 2026", title: "Chef du Département Génie Industriel", text: "ENSA Fès — coordination des équipes et des formations." },
  { when: "DEPUIS 2021", title: "Professeur d’enseignement supérieur", text: "ENSA Fès, USMBA. Professeur habilité de 2015 à 2021 ; professeur assistant de 2011 à 2015." },
  { when: "2016 — 2018", title: "Directeur adjoint du laboratoire LISA", text: "Membre fondateur. Responsable de l’équipe Mécatronique, Modélisation et Contrôle de 2018 à 2022." },
  { when: "2012 — 2018", title: "Coordonnateur de la filière Génie Industriel", text: "ENSA Fès — ingénierie pédagogique et suivi de la formation." },
  { when: "2009 — 2011", title: "Chargé de recherche — PSA", text: "Test et validation, Paris-Saclay, France." },
  { when: "2007 — 2009", title: "ATER", text: "Université de Dijon, puis Université de technologie de Compiègne." },
  { when: "2004 — 2008", title: "Doctorat", text: "Automatique et Informatique Industrielle, École Centrale de Lille — mention très honorable." },
  { when: "2004 · 2001", title: "DEA & maîtrises", text: "DEA Lille ; maîtrise EEA Lille ; maîtrise IEEA, FST de Fès." },
  { when: "1999 · 1996", title: "Formation initiale", text: "DEUG Physique-Chimie, FST de Fès ; baccalauréat scientifique, lycée Ibn Elhaitem." }
];

const theses = [
  { y: "2018", name: "Abderrahim Frih", t: "Contribution par l’approche graphique : de l’analyse à la commande" },
  { y: "2019", name: "Soukaina Krafes", t: "Stratégies de stabilisation des pendules sphériques inversés" },
  { y: "2020", name: "Khalid Badie", t: "Stabilité, commande et filtrage des systèmes bidimensionnels" },
  { y: "2022", name: "Boutaina Elkinany", t: "Commande des systèmes sous-actionnés" },
  { y: "2023", name: "Mohamed Oubaidi", t: "Stabilité et commande des systèmes 2D" },
  { y: "2024", name: "Narjiss Tilioua", t: "Les systèmes PLM (Product Lifecycle Management)" }
];

const pubs = [
  { y: "2026", title: "Delay-dependent H∞ filtering for 2D continuous state-delayed systems", meta: "IJSSE · avec Laila Dami et Khalid Badie", href: "https://doi.org/10.1504/ijsse.2026.10065584", tag: "ART-2026 · IJSSE" },
  { y: "2026", title: "Comparative Assessment of Temporal Deep Learning Architectures for Photovoltaic–Thermal System Thermal Efficiency Forecasting", meta: "Sustainability · avec Z. Tadlaoui, S. Handa, B. Elkari, M. Malvoni et Y. Chaibi", href: "https://doi.org/10.3390/su18136588", tag: "ART-2026 · SUSTAINABILITY" },
  { y: "2025", title: "Robust H∞ Filter Design for Uncertain 2-D Singular Continuous Systems With State-Varying Delay", meta: "Mathematical Methods in the Applied Sciences", href: "https://doi.org/10.1002/mma.10673", tag: "ART-2025 · MMAS" },
  { y: "2025", title: "Robust Secure Tracking Control for Uncertain 2-D Discrete Systems in a Networked Environment", meta: "International Journal of Adaptive Control and Signal Processing", href: "https://doi.org/10.1002/acs.3930", tag: "ART-2025 · IJACSP" },
  { y: "2024", title: "A Sliding Mode MPPT for Photovoltaic Applications: Case of Storage Systems", meta: "IEEE GPECOM 2024", href: "https://doi.org/10.1109/GPECOM61896.2024.10582752", tag: "ART-2024 · IEEE GPECOM" }
];

function ArticleCard({ pub, dup = false }) {
  return (
    <a className={`article-card${dup ? " dup" : ""}`} href={pub.href} tabIndex={-1}>
      <span className="tag">{pub.tag}</span>
      <h3>{pub.title}</h3>
      <p>{pub.meta}</p>
      <span className="go">VOIR LE DOI ↗</span>
    </a>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [solidNav, setSolidNav] = useState(false);
  const mobile = useIsMobile();

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    const bar = document.querySelector(".progress");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - innerHeight;
        if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
        setSolidNav(scrollY > Math.min(innerHeight * 0.55, 420));
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const navLinks = [...document.querySelectorAll(".links a")];
    const sections = navLinks
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          navLinks.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`)
          );
        });
      },
      { rootMargin: "-42% 0px -48% 0px" }
    );
    sections.forEach((s) => spy.observe(s));

    return () => {
      removeEventListener("scroll", onScroll);
      spy.disconnect();
    };
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <a className="skip" href="#contenu">Aller au contenu</a>

      <header className={`topbar${solidNav || open ? " solid" : ""}`}>
        <nav className="nav wrap" aria-label="Navigation principale">
          <a className="brand" href="#accueil" onClick={() => setOpen(false)}>
            <span className="mark">ZC</span>
            <span>
              ZAKARIA CHALH
              <small>DIRECTEUR · EST MEKNÈS</small>
            </span>
          </a>
          <button
            className="menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
          <div className={open ? "links open" : "links"} onClick={() => setOpen(false)}>
            <a href="#signal">Manifeste</a>
            <a href="#trajectoire">Trajectoire</a>
            <a href="#systeme">Système</a>
            <a href="#production">Production</a>
            <a href="#pilotage">Pilotage</a>
            <a className="nav-cta" href="#contact">Contact</a>
          </div>
        </nav>
      </header>
      {open ? (
        <button type="button" className="nav-scrim" aria-label="Fermer le menu" onClick={() => setOpen(false)} />
      ) : null}

      <main id="contenu">
        <section className="hero" id="accueil">
          <div className="shader-frame hero-flow" aria-hidden="true">
            {!mobile ? (
              <SceneMount>
                <StructureFlowCollection
                  variant="topology-field"
                  hue={0}
                  saturation={1.0}
                  brightness={1.0}
                />
              </SceneMount>
            ) : null}
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-kicker">
              {mobile ? (
                <span>Professeur d’enseignement supérieur</span>
              ) : (
                <DecryptedText
                  text="Professeur d’enseignement supérieur"
                  animateOn="view"
                  sequential
                  speed={28}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·"
                />
              )}
            </div>
            <h1 className="hero-name">
              {mobile ? (
                <>
                  <span className="first">Zakaria</span>
                  <span className="last">CHALH</span>
                </>
              ) : (
                <>
                  <BlurText
                    startOnMount
                    text="Zakaria"
                    className="first"
                    animateBy="letters"
                    delay={36}
                    direction="bottom"
                    stepDuration={0.28}
                  />
                  <BlurText
                    startOnMount
                    text="CHALH"
                    className="last"
                    animateBy="letters"
                    delay={28}
                    direction="bottom"
                    stepDuration={0.28}
                  />
                </>
              )}
            </h1>
            <p className="hero-line">Directeur de l’École Supérieure de Technologie de Meknès</p>
            <p className="hero-sub">
              Génie industriel, automatique et transformation institutionnelle — entre la France et le Maroc.
            </p>
            <a className="hero-cta" href="#signal">Entrer dans le dossier</a>
          </div>
          <figure className="hero-portrait">
            <img
              src={`${import.meta.env.BASE_URL}portrait.jpg`}
              alt="Zakaria CHALH lors d’une prise de parole au pupitre"
              width="168"
              height="168"
            />
          </figure>
        </section>

        <section className="signal" id="signal">
          <div className="wrap">
            <Reveal>
              <div className="label">01 — MANIFESTE</div>
              <blockquote>
                Enseignement, recherche et gouvernance universitaire : une expérience construite en France et au Maroc.
              </blockquote>
              <p className="prose">
                Docteur en Automatique et Informatique Industrielle de l’École Centrale de Lille (2008), Zakaria CHALH a
                exercé dans l’enseignement supérieur en France et la recherche industrielle chez PSA avant de rejoindre
                l’ENSA Fès en 2011. Professeur d’enseignement supérieur depuis 2021, il dirige l’EST de Meknès depuis 2026.
              </p>
            </Reveal>
          </div>
        </section>

        <Reveal as="div" className="instruments" delay={80}>
          <article>
            <div className="lbl">MANDAT</div>
            <strong>2026</strong>
            <span>Direction de l’EST de Meknès</span>
          </article>
          <article>
            <div className="lbl">UNIVERSITÉ</div>
            <strong>UMI</strong>
            <span>Université Moulay Ismaïl</span>
          </article>
          <article>
            <div className="lbl">EXPÉRIENCE</div>
            <strong>+<CountUp to={15} duration={1.3} /></strong>
            <span>Années d’enseignement supérieur</span>
          </article>
          <article>
            <div className="lbl">ORCID</div>
            <strong><CountUp to={84} duration={1.5} /></strong>
            <span>Travaux répertoriés</span>
          </article>
        </Reveal>

        {!mobile ? (
          <div className="belt" aria-hidden="true">
            <ScrollVelocity
              texts={[
                "GÉNIE INDUSTRIEL   ·   AUTOMATIQUE   ·   INFORMATIQUE INDUSTRIELLE   ·   SYSTÈMES 2D   ·   MÉCATRONIQUE   ·   INDUSTRIE 4.0   ·   GOUVERNANCE   ·   EST MEKNÈS   ·   "
              ]}
              velocity={40}
              numCopies={4}
            />
          </div>
        ) : (
          <div className="belt belt--static" aria-hidden="true">
            <p>GÉNIE INDUSTRIEL · AUTOMATIQUE · SYSTÈMES 2D · INDUSTRIE 4.0 · EST MEKNÈS</p>
          </div>
        )}

        <section className="chapter" id="trajectoire">
          <div className="wrap">
            <Reveal className="chapter-head">
              <div className="chapter-no">02</div>
              <div>
                <h2>Une trajectoire, de la recherche à la direction.</h2>
                <p className="prose">
                  {mobile
                    ? "Glissez horizontalement la ligne de parcours pour avancer d’un poste à l’autre."
                    : "Faites défiler horizontalement la ligne de parcours — comme une chaîne de postes dans un système industriel."}
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="track-wrap">
                <div className="track">
                  {stations.map((s) => (
                    <article className="station" key={s.title + s.when}>
                      <div className="when">{s.when}</div>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </article>
                  ))}
                </div>
              </div>
              <p className="track-hint">GLISSER → POUR AVANCER SUR LA LIGNE</p>
            </Reveal>
            <Reveal delay={160} className="scene-block">
              <div className="scene-caption">
                <span className="scene-tag">DOSSIER · MANDAT</span>
                <p className="prose">
                  De l’École Centrale de Lille (doctorat 2008, mention très honorable) à la direction de l’EST de Meknès
                  (depuis 2026) — un parcours académique lisible comme un certificat en volume.
                </p>
              </div>
              <div className="shader-frame scene-stage scene-stage--paper">
                <SceneMount label="Activer le certificat 3D" desktopOnly>
                  <ThreeDPaper variant="original" />
                </SceneMount>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="chapter system" id="systeme">
          <div className="wrap">
            <Reveal className="chapter-head">
              <div className="chapter-no">03</div>
              <div>
                <h2>Des systèmes intelligents, robustes et utiles.</h2>
                <p className="prose">
                  Les travaux s’inscrivent dans l’automatique et l’ingénierie, avec une attention particulière portée à
                  la modélisation, la stabilité et la transformation industrielle.
                </p>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <div className="band">
                <div className="idx">01</div>
                <div>
                  <h3>Automatique — analyse &amp; commande</h3>
                  <p className="prose">
                    Commande des systèmes sous-actionnés, approches graphiques et stabilisation des pendules sphériques inversés.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="band">
                <div className="idx">02</div>
                <div>
                  <h3>Systèmes — stabilité &amp; réseaux</h3>
                  <p className="prose">
                    Stabilité, commande et filtrage des systèmes bidimensionnels et multidimensionnels, notamment les systèmes 2D à retard.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="band">
                <div className="idx">03</div>
                <div>
                  <h3>Industrie — énergie &amp; robotique</h3>
                  <p className="prose">
                    Systèmes hybrides solaires, systèmes à commutations, Power-to-X et asservissement visuel des robots manipulateurs.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={220}>
              <div className="loop-line">
                <b>BOUCLE</b>
                <span>COMMANDE</span>
                <span>→</span>
                <span>SYSTÈME</span>
                <span>→</span>
                <span>MESURE</span>
                <span>→</span>
                <span>RETOUR</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="chapter" id="transmission">
          <div className="wrap">
            <Reveal className="chapter-head">
              <div className="chapter-no">04</div>
              <div>
                <h2>Transmettre : formations, thèses, ingénierie pédagogique.</h2>
                <p className="prose">
                  Former aux systèmes et à l’industrie, accompagné d’un encadrement doctoral soutenu.
                </p>
              </div>
            </Reveal>
            <div className="split">
              <Reveal>
                <dl className="def">
                  <div>
                    <dt>Automatique et mécatronique</dt>
                    <dd>Systèmes dynamiques, électronique non linéaire, robotique industrielle, identification et traitement du signal.</dd>
                  </div>
                  <div>
                    <dt>Informatique industrielle</dt>
                    <dd>Réseaux de Petri, simulation de flux, bus CAN, LabVIEW et automates programmables.</dd>
                  </div>
                  <div>
                    <dt>Ingénierie des formations</dt>
                    <dd>Filières Mécatronique, Génie Industriel, GMSA, Génie Énergétique et Systèmes Intelligents. Renouvellement GI en 2014 et 2024.</dd>
                  </div>
                  <div>
                    <dt>Formation continue</dt>
                    <dd>Coordination du Bac+5 Management Industriel et Ingénierie ; expertise et accréditations à l’USMBA.</dd>
                  </div>
                </dl>
              </Reveal>
              <Reveal delay={140}>
                <div className="live"><i /> SIX THÈSES SOUTENUES</div>
                <div className="thesis-stack">
                  {theses.map((t) => (
                    <article key={t.y + t.name}>
                      <div className="y">{t.y}</div>
                      <div>
                        <h3>{t.name}</h3>
                        <p>{t.t}</p>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="aside-note">
                  79 projets de fin d’études encadrés (2011–2022). Participation à des jurys de doctorat et d’habilitation.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="chapter production" id="production">
          <div className="wrap">
            <Reveal className="chapter-head">
              <div className="chapter-no">05</div>
              <div>
                <h2>Production scientifique en mouvement.</h2>
                <p className="prose">
                  Systèmes 2D, commande robuste, énergies renouvelables et architectures d’apprentissage profond.
                </p>
              </div>
            </Reveal>
            <Reveal className="meter" delay={80}>
              <div><strong><CountUp to={84} duration={1.5} /></strong><span>travaux ORCID</span></div>
              <div><strong>Scopus</strong><span>24172407700</span></div>
              <div><strong><CountUp to={6} duration={1.1} /></strong><span>thèses</span></div>
              <div><strong><CountUp to={79} duration={1.5} /></strong><span>PFE encadrés</span></div>
            </Reveal>
            <Reveal delay={100} className="scene-block">
              <div className="scene-caption">
                <span className="scene-tag">RAYON · PRODUCTION</span>
                <p className="prose">
                  Explorez l’étagère : les volumes renvoient à la production réelle — 84 travaux ORCID, Scopus
                  24172407700, et les lignes récentes (IJSSE, Sustainability, MMAS, IJACSP, IEEE GPECOM).
                </p>
              </div>
              <div className="shader-frame scene-stage scene-stage--ashen">
                <SceneMount label="Activer l’étagère 3D" desktopOnly>
                  <AshenPress />
                </SceneMount>
              </div>
            </Reveal>
            {!mobile ? <div className="live"><i /> LIGNE D’ARTICLES — SURVOLEZ POUR PAUSER</div> : null}
          </div>
          {!mobile ? (
            <div className="conveyor" aria-hidden="true">
              <div className="conveyor-track">
                <div className="set">{pubs.map((p) => <ArticleCard key={p.href} pub={p} />)}</div>
                <div className="set">{pubs.map((p) => <ArticleCard key={`${p.href}-d`} pub={p} dup />)}</div>
              </div>
            </div>
          ) : null}
          <div className="wrap">
            <Reveal delay={100}>
              <div className="pub-rows">
                {pubs.map((p) => (
                  <a key={p.href} href={p.href} target="_blank" rel="noopener">
                    <div className="y">{p.y}</div>
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.meta}</p>
                    </div>
                    <span className="doi">DOI ↗</span>
                  </a>
                ))}
              </div>
              <div className="all-works">
                <a href="https://orcid.org/0000-0003-0838-4152" target="_blank" rel="noopener">
                  Consulter les 84 travaux sur ORCID →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="chapter" id="pilotage">
          <div className="wrap">
            <Reveal className="chapter-head">
              <div className="chapter-no">06</div>
              <div>
                <h2>Pilotage : projets, gouvernance, partenariats.</h2>
                <p className="prose">
                  Une pratique de direction à l’échelle de l’établissement et du territoire.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="log">
                <article>
                  <div className="code">P-01</div>
                  <div>
                    <h3>Smart Digital EST</h3>
                    <p className="prose">
                      Écosystème intégré pour les notes, délibérations, ressources humaines, inventaire et infrastructure réseau.
                    </p>
                  </div>
                </article>
                <article>
                  <div className="code">P-02</div>
                  <div>
                    <h3>Industrie 4.0 &amp; formations professionnalisantes</h3>
                    <p className="prose">
                      Parcours alignés sur les mutations industrielles et les besoins du territoire.
                    </p>
                  </div>
                </article>
                <article>
                  <div className="code">P-03</div>
                  <div>
                    <h3>Management Industriel &amp; Ingénierie</h3>
                    <p className="prose">
                      Programme Bac+5 de formation continue pour cadres et professionnels de l’industrie.
                    </p>
                  </div>
                </article>
                <article>
                  <div className="code">P-04</div>
                  <div>
                    <h3>Qualité et réussite étudiante</h3>
                    <p className="prose">
                      Processus académiques lisibles, suivi régulier et décisions fondées sur les données.
                    </p>
                  </div>
                </article>
              </div>
            </Reveal>
            <Reveal delay={100} className="scene-block">
              <div className="scene-caption">
                <span className="scene-tag">COLLECTION · PILOTAGE</span>
                <p className="prose">
                  Sept volumes pour le pilotage de l’établissement : P-01 Smart Digital EST, P-02 Industrie 4.0,
                  P-03 Management Industriel, P-04 Qualité et réussite étudiante, puis gouvernance, partenariats et animation.
                </p>
              </div>
              <div className="shader-frame scene-stage scene-stage--shelf">
                <SceneMount label="Activer la collection 3D" desktopOnly>
                  <BookshelfScene />
                </SceneMount>
              </div>
            </Reveal>
            <Reveal className="gov" delay={120}>
              <div>
                <h3>GOUVERNANCE</h3>
                <p className="prose">
                  Conseil de l’Université USMBA, commissions académiques et de recherche, conseil d’établissement de
                  l’ENSA Fès, comités paritaires, règlements intérieurs.
                </p>
              </div>
              <div>
                <h3>ANIMATION</h3>
                <p className="prose">
                  Chair CIMSI 2016, Workshop on Complex Systems Engineering 2018, congrès ICECS 2021 et 2023,
                  activités éditoriales.
                </p>
              </div>
              <div>
                <h3>PARTENARIATS</h3>
                <p className="prose">
                  Coopération maroco-tunisienne, Smart Medina, double diplomation CNAM, conventions ULCO et ENSIM.
                </p>
              </div>
              <div>
                <h3>ENGAGEMENT</h3>
                <p className="prose">
                  Associations AMID et AMTI, Œuvres Sociales de l’ENSA Fès, Centre de réflexion, de recherche et de
                  proposition (2022).
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="finale" id="contact">
          <img
            className="finale-photo"
            src={`${import.meta.env.BASE_URL}hero-industrial.png`}
            alt=""
            aria-hidden="true"
          />
          <div className="finale-shade" aria-hidden="true" />
          <div className="wrap">
            <Reveal>
              <h2>Écrire, citer, poursuivre le dialogue.</h2>
              <p>ORCID 0000-0003-0838-4152 · Domaine vérifié usmba.ac.ma</p>
              <div className="profile-links">
                <a href="mailto:zakaria.chalh@usmba.ac.ma">Écrire par e-mail ↗</a>
                <a href="https://www.linkedin.com/in/zakaria-chalh-50792981/" target="_blank" rel="noopener">LinkedIn ↗</a>
                <a href="https://orcid.org/0000-0003-0838-4152" target="_blank" rel="noopener">ORCID ↗</a>
                <a href="https://www.scopus.com/authid/detail.uri?authorId=24172407700" target="_blank" rel="noopener">Scopus ↗</a>
                <a href="https://sciprofiles.com/profile/3252178" target="_blank" rel="noopener">SciProfiles ↗</a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot">
          <span>© <span id="year"></span> Zakaria CHALH</span>
          <span>Direction · Recherche · Génie industriel</span>
        </div>
      </footer>
    </>
  );
}
