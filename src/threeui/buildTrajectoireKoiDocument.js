/**
 * Patch exact ThreeUI synthralos-halftone.html with Trajectoire stations,
 * institution logos (clear contain fit), theme chrome, click-to-detail,
 * side-host nav bridge, N-stop deck — without laggy CDN shader / mask loop.
 */

const PANEL_DARK = [
  { panel: '#1a1d21', ink: '#ececea', accent: '#c29a5b' },
  { panel: '#1c1f23', ink: '#ececea', accent: '#c29a5b' },
  { panel: '#181b1f', ink: '#ececea', accent: '#c29a5b' },
];

const PANEL_LIGHT = [
  { panel: '#f4f5f3', ink: '#16181b', accent: '#8c6a2e' },
  { panel: '#eceeeb', ink: '#16181b', accent: '#8c6a2e' },
  { panel: '#f0f1ef', ink: '#16181b', accent: '#8c6a2e' },
];

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function splitWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function buildCopyHtml(role, detail) {
  const roleWords = splitWords(role);
  const detailWords = splitWords(detail);
  const lines = [];
  let idx = 0;
  const pushLine = (words) => {
    const parts = words.map(
      (word, i) =>
        `<span class="word-reveal"><span class="reveal-word" style="--reveal-index: ${idx + i}">${escapeHtml(word)}</span></span>`,
    );
    lines.push(parts.join(' '));
    idx += words.length;
  };

  if (roleWords.length <= 5) pushLine(roleWords);
  else {
    const mid = Math.ceil(roleWords.length / 2);
    pushLine(roleWords.slice(0, mid));
    pushLine(roleWords.slice(mid));
  }
  if (detailWords.length) {
    pushLine(detailWords.slice(0, Math.min(8, detailWords.length)));
    const rest = detailWords.slice(Math.min(8, detailWords.length));
    if (rest.length) pushLine(rest.slice(0, 10));
  }
  return { html: lines.join('<br>'), count: idx };
}

function buildCardMarkup(station, cardId, theme) {
  const palette = (theme === 'light' ? PANEL_LIGHT : PANEL_DARK)[cardId % 3];
  const { html: copy, count } = buildCopyHtml(station.role, station.detail);
  const wordmark = station.place || station.institution;
  const mark = station.mark || station.years;
  const label = `${station.role}. ${station.years}. ${station.institution}. ${station.detail}`;

  return `<div
        class="stack-shell"
        data-card-id="${cardId}"
        data-name="${escapeHtml(wordmark)}"
        role="button"
        tabindex="${cardId === 0 ? '0' : '-1'}"
        aria-label="${escapeHtml(label)} Cliquez pour les détails. Glissez pour naviguer."
      >
        <div class="drag-plane">
          <article class="artwork" style="--panel: ${palette.panel}; --ink: ${palette.ink}; --accent-card: ${palette.accent};">
            <canvas class="image-field" width="676" height="644" aria-hidden="true"></canvas>
            <section class="copy-panel" aria-label="${escapeHtml(station.role)}">
              <p class="copy" aria-hidden="true">${copy}</p>
              <div class="brand-lockup" aria-label="${escapeHtml(wordmark)}">
                <span class="wordmark reveal-lockup" style="--reveal-index: ${count}">${escapeHtml(wordmark)}</span>
                <span class="hanko hanko-card-${cardId} reveal-lockup" style="--reveal-index: ${count + 1}" aria-hidden="true"><span>${escapeHtml(mark)}</span></span>
              </div>
            </section>
          </article>
        </div>
      </div>`;
}

function applyTheme(html, theme) {
  if (theme !== 'light') {
    return html
      .replace(/--field:\s*#10100e;/, '--field: #15171a;')
      .replace(/--paper:\s*#eee6d0;/, '--paper: #ececea;')
      .replace(/--muted:\s*#a39b88;/, '--muted: #a3a6a9;')
      .replace(
        /radial-gradient\(circle at 52% 42%, rgb\(201 92 63 \/ 0\.055\), transparent 27rem\),\s*radial-gradient\(circle at 45% 55%, rgb\(238 230 208 \/ 0\.035\), transparent 40rem\),\s*var\(--field\);/,
        `radial-gradient(circle at 52% 42%, rgb(194 154 91 / 0.08), transparent 27rem),
        radial-gradient(circle at 45% 55%, rgb(236 236 234 / 0.03), transparent 40rem),
        var(--field);`,
      );
  }
  let next = html;
  next = next.replace(/--field:\s*#10100e;/, '--field: #f4f5f3;');
  next = next.replace(/--paper:\s*#eee6d0;/, '--paper: #16181b;');
  next = next.replace(/--muted:\s*#a39b88;/, '--muted: #4b4f54;');
  next = next.replace(
    'name="color-scheme" content="dark"',
    'name="color-scheme" content="light"',
  );
  next = next.replace(
    /radial-gradient\(circle at 52% 42%, rgb\(201 92 63 \/ 0\.055\), transparent 27rem\),\s*radial-gradient\(circle at 45% 55%, rgb\(238 230 208 \/ 0\.035\), transparent 40rem\),\s*var\(--field\);/,
    `radial-gradient(circle at 52% 42%, rgb(140 106 46 / 0.08), transparent 27rem),
        radial-gradient(circle at 45% 55%, rgb(22 24 27 / 0.04), transparent 40rem),
        var(--field);`,
  );
  next = next.replace(
    /\{ color: "#24261f", position: 0 \},\s*\{ color: "#4a433d", position: 1 \}/,
    '{ color: "#e8ebe4", position: 0 },\n                    { color: "#cfd4cb", position: 1 }',
  );
  return next;
}

function injectDeckLogic(html, stations, theme) {
  const stationsJson = JSON.stringify(
    stations.map((s) => ({
      years: s.years,
      mark: s.mark,
      role: s.role,
      institution: s.institution,
      place: s.place,
      detail: s.detail,
      logo: s.logo,
    })),
  );
  const light = theme === 'light';

  const deckPrelude = `
      const TRAJECTOIRE_STATIONS = ${stationsJson};
      const TRAJECTOIRE_LIGHT = ${light ? 'true' : 'false'};
      const trajectoireMod = (n, m) => ((n % m) + m) % m;
      let trajectoireFront = 0;

      const trajectoireWordsHtml = (role, detail) => {
        const roleWords = String(role || "").trim().split(/\\s+/).filter(Boolean);
        const detailWords = String(detail || "").trim().split(/\\s+/).filter(Boolean);
        const lines = [];
        let idx = 0;
        const push = (words) => {
          lines.push(words.map((word, i) =>
            '<span class="word-reveal"><span class="reveal-word" style="--reveal-index: ' + (idx + i) + '">' +
            String(word).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') +
            '</span></span>'
          ).join(" "));
          idx += words.length;
        };
        if (roleWords.length <= 5) push(roleWords);
        else {
          const mid = Math.ceil(roleWords.length / 2);
          push(roleWords.slice(0, mid));
          push(roleWords.slice(mid));
        }
        if (detailWords.length) {
          push(detailWords.slice(0, Math.min(8, detailWords.length)));
          const rest = detailWords.slice(Math.min(8, detailWords.length));
          if (rest.length) push(rest.slice(0, 10));
        }
        return { html: lines.join("<br>"), count: idx };
      };

      const trajectoireDrawFallbackMark = (card) => {
        const ctx = card.context;
        const label = String(card.shell?.dataset?.name || "CHALH").toUpperCase();
        ctx.fillStyle = TRAJECTOIRE_LIGHT ? "rgba(22,24,27,0.82)" : "rgba(236,236,234,0.88)";
        ctx.font = "700 48px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label.slice(0, 18), WIDTH / 2, HEIGHT / 2 - HEIGHT * 0.04);
      };

      const trajectoireFieldFill = () =>
        TRAJECTOIRE_LIGHT ? "#f4f5f3" : "#15171a";

      const trajectoireDrawLogo = (card) => {
        const ctx = card.context;
        ctx.fillStyle = trajectoireFieldFill();
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        if (!card.imageReady) return;
        if (!card.imageUsable) {
          trajectoireDrawFallbackMark(card);
          return;
        }
        const img = card.image;
        const iw = img.naturalWidth || WIDTH;
        const ih = img.naturalHeight || HEIGHT;
        if (!iw || !ih) {
          trajectoireDrawFallbackMark(card);
          return;
        }
        // Match .logo-band__logo: mono invert/black, large contain, no plate
        const padX = WIDTH * 0.08;
        const padY = HEIGHT * 0.1;
        const maxW = WIDTH - padX * 2;
        const maxH = HEIGHT - padY * 2;
        const ratio = iw / ih;
        let dw = maxW;
        let dh = dw / ratio;
        if (dh > maxH) {
          dh = maxH;
          dw = dh * ratio;
        }
        const dx = (WIDTH - dw) / 2;
        const dy = (HEIGHT - dh) / 2 - HEIGHT * 0.045;
        ctx.save();
        ctx.globalAlpha = TRAJECTOIRE_LIGHT ? 0.78 : 0.86;
        ctx.filter = TRAJECTOIRE_LIGHT
          ? "brightness(0)"
          : "brightness(0) invert(1)";
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.filter = "none";
        ctx.globalAlpha = 1;
        ctx.restore();
      };

      const bindTrajectoireCard = (card, stationIndex) => {
        if (!card) return;
        const station = TRAJECTOIRE_STATIONS[trajectoireMod(stationIndex, TRAJECTOIRE_STATIONS.length)];
        const shell = card.shell;
        const copy = shell.querySelector(".copy");
        const wordmark = shell.querySelector(".wordmark");
        const hanko = shell.querySelector(".hanko span");
        const brand = shell.querySelector(".brand-lockup");
        const copyPanel = shell.querySelector(".copy-panel");
        const built = trajectoireWordsHtml(station.role, station.detail);
        if (copy) copy.innerHTML = built.html;
        if (wordmark) {
          wordmark.textContent = station.place || station.institution;
          wordmark.style.setProperty("--reveal-index", String(built.count));
        }
        if (hanko) {
          hanko.removeAttribute("lang");
          hanko.textContent = station.mark || station.years;
        }
        if (brand) brand.setAttribute("aria-label", station.place || station.institution);
        if (copyPanel) copyPanel.setAttribute("aria-label", station.role);
        shell.dataset.name = station.place || station.institution;
        shell.dataset.stationIndex = String(trajectoireMod(stationIndex, TRAJECTOIRE_STATIONS.length));
        shell.setAttribute(
          "aria-label",
          station.role + ". " + station.years + ". " + station.institution + ". Cliquez pour les détails."
        );
        card.videoUsable = false;
        card.imageReady = false;
        card.imageUsable = false;
        card.image.addEventListener("load", () => {
          card.imageReady = true;
          card.imageUsable = true;
          trajectoireDrawLogo(card);
        }, { once: true });
        card.image.addEventListener("error", () => {
          card.imageReady = true;
          card.imageUsable = false;
          trajectoireDrawLogo(card);
        }, { once: true });
        card.image.src = station.logo;
        parent.postMessage({
          koiStudies: {
            type: "index",
            index: trajectoireMod(trajectoireFront, TRAJECTOIRE_STATIONS.length),
            total: TRAJECTOIRE_STATIONS.length,
          },
        }, "*");
      };

      `;

  let next = html.replace(
    'const sendToBack = (card, vectorX = 1, vectorY = 0) => {',
    `${deckPrelude}const sendToBack = (card, vectorX = 1, vectorY = 0) => {`,
  );
  if (next === html) {
    next = html.replace(
      'sendToBack = (card, vectorX = 1, vectorY = 0) => {',
      `${deckPrelude}sendToBack = (card, vectorX = 1, vectorY = 0) => {`,
    );
  }

  // Clear logo painting instead of cover-crop + grid
  next = next.replace(
    'const drawMediaAndGrid = card => {\n        if (!card.imageReady) return;\n\n        const { context } = card;\n        context.fillStyle = card.panelColor;\n        context.fillRect(0, 0, WIDTH, HEIGHT);\n        if (!card.imageUsable && !card.videoUsable) return;',
    `const drawMediaAndGrid = card => {
        if (typeof TRAJECTOIRE_STATIONS !== "undefined") {
          trajectoireDrawLogo(card);
          return;
        }
        if (!card.imageReady) return;

        const { context } = card;
        context.fillStyle = card.panelColor;
        context.fillRect(0, 0, WIDTH, HEIGHT);
        if (!card.imageUsable && !card.videoUsable) return;`,
  );

  // Skip pixel-mask overlay that was hiding logos
  next = next.replace(
    'const drawMaskedFrame = (card, frame, isTop, now) => {\n        if (!card.imageReady) return;\n\n        drawMediaAndGrid(card);',
    `const drawMaskedFrame = (card, frame, isTop, now) => {
        if (!card.imageReady) return;
        if (typeof TRAJECTOIRE_STATIONS !== "undefined") {
          trajectoireDrawLogo(card);
          return;
        }

        drawMediaAndGrid(card);`,
  );

  // Skip continuous mask animation — static logos only (smooth)
  next = next.replace(
    'const shouldAnimateCanvas = () =>\n        cards.every(card => card.imageReady) &&\n        inView &&\n        focused &&\n        (\n          canAnimateField() ||\n          (!reducedMotion.matches && cards.some(card => card.videoUsable))\n        );',
    `const shouldAnimateCanvas = () => {
        if (typeof TRAJECTOIRE_STATIONS !== "undefined") return false;
        return cards.every(card => card.imageReady) &&
        inView &&
        focused &&
        (
          canAnimateField() ||
          (!reducedMotion.matches && cards.some(card => card.videoUsable))
        );
      };`,
  );

  next = next.replace(
    `order = [card.id, ...order.filter(id => id !== card.id)];
          card.shell.style.transition = "none";`,
    `order = [card.id, ...order.filter(id => id !== card.id)];
          trajectoireFront += 1;
          bindTrajectoireCard(card, trajectoireFront + 2);
          card.shell.style.transition = "none";`,
  );

  next = next.replace(
    `const incoming = cards[order[0]];
        const hadFocus = document.activeElement === outgoing.shell;
        const distance = Math.max(190, scene.getBoundingClientRect().width * 0.66);
        const duration = reducedMotion.matches ? 0 : 360;

        incoming.shell.style.transition = "none";`,
    `const incoming = cards[order[0]];
        const hadFocus = document.activeElement === outgoing.shell;
        const distance = Math.max(190, scene.getBoundingClientRect().width * 0.66);
        const duration = reducedMotion.matches ? 0 : 360;
        trajectoireFront -= 1;
        bindTrajectoireCard(incoming, trajectoireFront);

        incoming.shell.style.transition = "none";`,
  );

  // Click opens detail; drag still navigates
  next = next.replace(
    `card.shell.addEventListener("click", () => {
          if (performance.now() >= card.suppressClickUntil) {
            sendToBack(card, 1, 0);
          }
        });`,
    `card.shell.addEventListener("click", () => {
          if (performance.now() >= card.suppressClickUntil) {
            if (typeof TRAJECTOIRE_STATIONS !== "undefined") {
              const idx = trajectoireMod(
                Number(card.shell.dataset.stationIndex || trajectoireFront),
                TRAJECTOIRE_STATIONS.length
              );
              parent.postMessage({ koiStudies: { type: "open", index: idx } }, "*");
              return;
            }
            sendToBack(card, 1, 0);
          }
        });`,
  );

  next = next.replace(
    `card.shell.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            sendToBack(card, 1, 0);
          }
        });`,
    `card.shell.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (typeof TRAJECTOIRE_STATIONS !== "undefined") {
              const idx = trajectoireMod(
                Number(card.shell.dataset.stationIndex || trajectoireFront),
                TRAJECTOIRE_STATIONS.length
              );
              parent.postMessage({ koiStudies: { type: "open", index: idx } }, "*");
              return;
            }
            sendToBack(card, 1, 0);
          }
        });`,
  );

  next = next.replace(
    `card.image.src = IMAGE_DATA[card.id];
        card.video.src = VIDEO_DATA[card.id];
        card.video.load();
      }`,
    `card.image.src = IMAGE_DATA[card.id];
        if (typeof TRAJECTOIRE_STATIONS === "undefined") {
          card.video.src = VIDEO_DATA[card.id];
          card.video.load();
        } else {
          card.videoUsable = false;
        }
      }`,
  );

  next = next.replace(
    'window.addEventListener("keydown", handleGlobalKeyDown);',
    `window.addEventListener("keydown", handleGlobalKeyDown);
      window.__koiStudies = {
        next: () => sendToBack(topCard(), 1, 0),
        prev: () => bringPreviousToFront(),
      };
      window.addEventListener("message", (event) => {
        if (event.source !== parent) return;
        const msg = event.data && event.data.koiStudies;
        if (!msg) return;
        if (msg.type === "next") sendToBack(topCard(), 1, 0);
        if (msg.type === "prev") bringPreviousToFront();
      });
      parent.postMessage({
        koiStudies: { type: "index", index: 0, total: TRAJECTOIRE_STATIONS.length },
      }, "*");
      // Initial bind for 3 seeded cards after boot
      queueMicrotask(() => {
        if (typeof cards === "undefined") return;
        cards.forEach((card, i) => bindTrajectoireCard(card, i));
        cards.forEach((card) => trajectoireDrawLogo(card));
      });`,
  );

  return next;
}

/**
 * @param {string} originalHtml exact synthralos-halftone source
 * @param {Array} stations stations with logo URL
 * @param {'dark'|'light'} theme
 */
export function buildTrajectoireKoiDocument(originalHtml, stations, theme = 'dark') {
  if (!stations?.length) return originalHtml;

  const seed = stations.slice(0, 3);
  while (seed.length < 3) seed.push(stations[seed.length % stations.length]);

  let html = originalHtml;

  // Kill CDN Fluid Pastels shader — major lag source
  html = html.replace(
    'mountFluidPastels();',
    'setShaderStatus("fallback"); /* chalh: skip CDN shader for smooth Trajectoire */',
  );
  html = html.replace(
    /<canvas id="fluid-pastels-background"[\s\S]*?<\/canvas>/,
    '<canvas id="fluid-pastels-background" hidden aria-hidden="true"></canvas>',
  );

  const stackStart = html.indexOf('<div class="stack" role="group"');
  const stackEnd = html.indexOf('<p class="interaction-hint"');
  if (stackStart === -1 || stackEnd === -1) {
    throw new Error('KoiStudies stack markup not found in source');
  }
  const stackOpenEnd = html.indexOf('>', stackStart) + 1;
  const cardsHtml = seed.map((station, i) => buildCardMarkup(station, i, theme)).join('\n\n      ');
  html =
    html.slice(0, stackOpenEnd) +
    `\n      ${cardsHtml}\n    </div>\n    ` +
    html.slice(stackEnd);

  html = html.replace(
    '← drag next · tap next · drag previous →',
    '← glisser · cliquer pour détails · flèches →',
  );
  html = html.replace(
    'Drag left for the next card or right for the previous card. Tap for next. Use the Left and Right Arrow keys.',
    'Glissez pour naviguer. Cliquez une carte pour ouvrir les détails. Flèches du clavier.',
  );

  html = html.replace(
    /const IMAGE_DATA = \[[\s\S]*?\];/,
    `const IMAGE_DATA = ${JSON.stringify(seed.map((s) => s.logo))};`,
  );
  html = html.replace(
    /const VIDEO_DATA = \[[\s\S]*?\];/,
    `const VIDEO_DATA = ${JSON.stringify(['', '', ''])};`,
  );

  html = applyTheme(html, theme);
  html = injectDeckLogic(html, stations, theme);

  html = html.replace(
    '</style>',
    `/* chalh trajectoire — bigger swipe cards, clear stop titles, no square plate */
    #fluid-pastels-background { display: none !important; }
    html, body {
      background: var(--field) !important;
    }
    .stack-scene {
      width: min(96vw, 94vh) !important;
      max-width: 100% !important;
      transform: scale(1.08);
      transform-origin: center center;
    }
    @media (max-width: 720px) {
      .stack-scene {
        width: min(98vw, 86vh) !important;
        transform: scale(1.14);
      }
    }
    .image-field {
      background: transparent !important;
    }
    .artwork {
      border-radius: 1.6cqw !important;
      box-shadow:
        0 3.4cqw 8cqw rgb(0 0 0 / 0.28) !important;
      outline: none !important;
      border: 0 !important;
    }
    .artwork::before,
    .artwork::after {
      display: none !important;
    }
    .hanko span {
      font-size: 2.05cqw;
      font-weight: 700;
      letter-spacing: 0.04em;
      line-height: 1;
      text-transform: none;
      font-family: "Geist", Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .wordmark {
      max-width: 58cqw;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: "Geist", Inter, ui-sans-serif, system-ui, sans-serif !important;
      font-style: normal !important;
      font-weight: 700 !important;
      font-size: clamp(2.7cqw, 3.35cqw, 3.9cqw) !important;
      letter-spacing: -0.02em !important;
    }
    .copy {
      font-family: "Geist", Inter, ui-sans-serif, system-ui, sans-serif !important;
      font-style: normal !important;
      font-size: clamp(2.85cqw, 3.5cqw, 4.1cqw) !important;
      font-weight: 650 !important;
      letter-spacing: -0.028em !important;
      line-height: 1.14 !important;
    }
    .copy-panel {
      box-shadow: none !important;
      padding-block: 1.35cqw !important;
      background: color-mix(in srgb, var(--panel) 92%, transparent) !important;
    }
    .stack-shell {
      cursor: pointer;
    }
    .interaction-hint {
      font-family: "Geist", Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: 0.08em;
      opacity: 0.72;
    }
    </style>`,
  );

  return html;
}
