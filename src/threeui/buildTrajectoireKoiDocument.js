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
  // Plain text — no word-reveal layers (those were overlapping on rebind)
  const roleHtml = escapeHtml(role || '');
  const detailHtml = escapeHtml(detail || '');
  return { roleHtml, detailHtml, count: 0 };
}

function buildCardMarkup(station, cardId, theme) {
  const palette = (theme === 'light' ? PANEL_LIGHT : PANEL_DARK)[cardId % 3];
  const { roleHtml, detailHtml } = buildCopyHtml(station.role, station.detail);
  const city = station.place || station.institution;
  const period = station.years || station.mark || '';
  const label = `${station.role}. ${station.years}. ${station.institution}. ${station.detail}`;

  return `<div
        class="stack-shell"
        data-card-id="${cardId}"
        data-name="${escapeHtml(city)}"
        role="button"
        tabindex="${cardId === 0 ? '0' : '-1'}"
        aria-label="${escapeHtml(label)} Cliquez pour les détails. Glissez pour naviguer."
      >
        <div class="drag-plane">
          <article class="artwork" style="--panel: ${palette.panel}; --ink: ${palette.ink}; --accent-card: ${palette.accent};">
            <canvas class="image-field" width="676" height="644" aria-hidden="true"></canvas>
            <section class="copy-panel" aria-label="${escapeHtml(station.role)}">
              <p class="copy copy--role" aria-hidden="true">${roleHtml}</p>
              ${detailHtml ? `<p class="copy copy--detail" aria-hidden="true">${detailHtml}</p>` : ''}
              <p class="copy copy--meta" aria-hidden="true">
                <span class="meta-city">${escapeHtml(city)}</span>
                <span class="meta-sep" aria-hidden="true"> · </span>
                <span class="meta-period">${escapeHtml(period)}</span>
              </p>
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

      const trajectoireWordsHtml = (role, detail) => ({
        roleHtml: String(role || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),
        detailHtml: String(detail || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),
        count: 0,
      });

      const trajectoireDrawFallbackMark = (card) => {
        const ctx = card.context;
        const label = String(card.shell?.dataset?.name || "CHALH").toUpperCase();
        ctx.fillStyle = TRAJECTOIRE_LIGHT ? "rgba(22,24,27,0.82)" : "rgba(236,236,234,0.88)";
        ctx.font = "700 36px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label.slice(0, 18), WIDTH / 2, HEIGHT * 0.32);
      };

      const trajectoireDrawLogo = (card) => {
        try {
          const ctx = card.context;
          if (!ctx) return;
          const panel = card.panelColor || (TRAJECTOIRE_LIGHT ? "#f4f5f3" : "#1a1d21");
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.globalAlpha = 1;
          ctx.filter = "none";
          ctx.fillStyle = panel;
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
          if (!card.imageReady) return;
          if (!card.imageUsable || !card.image) {
            trajectoireDrawFallbackMark(card);
            return;
          }
          const img = card.image;
          const iw = img.naturalWidth || 0;
          const ih = img.naturalHeight || 0;
          if (!iw || !ih) {
            trajectoireDrawFallbackMark(card);
            return;
          }
          const zoneTop = HEIGHT * 0.08;
          const zoneH = HEIGHT * 0.72;
          const padX = WIDTH * 0.18;
          const maxW = WIDTH - padX * 2;
          const maxH = zoneH * 0.85;
          const ratio = iw / ih;
          let dw = maxW;
          let dh = dw / ratio;
          if (dh > maxH) {
            dh = maxH;
            dw = dh * ratio;
          }
          const tw = Math.max(1, Math.round(dw));
          const th = Math.max(1, Math.round(dh));
          const dx = Math.round((WIDTH - tw) / 2);
          const dy = Math.round(zoneTop + (zoneH - th) / 2);
          ctx.save();
          ctx.globalAlpha = TRAJECTOIRE_LIGHT ? 0.82 : 0.9;
          ctx.imageSmoothingEnabled = true;
          // Same mono as logo band — keep it simple so logos always show
          ctx.filter = TRAJECTOIRE_LIGHT
            ? "brightness(0)"
            : "brightness(0) invert(1)";
          ctx.drawImage(img, dx, dy, tw, th);
          ctx.restore();
        } catch (err) {
          try { trajectoireDrawFallbackMark(card); } catch (e2) {}
        }
      };

      const bindTrajectoireCard = (card, stationIndex) => {
        if (!card) return;
        try {
          const station = TRAJECTOIRE_STATIONS[trajectoireMod(stationIndex, TRAJECTOIRE_STATIONS.length)];
          if (!station) return;
          const shell = card.shell;
          const roleEl = shell.querySelector(".copy--role");
          const detailEl = shell.querySelector(".copy--detail");
          const cityEl = shell.querySelector(".meta-city");
          const periodEl = shell.querySelector(".meta-period");
          const copyPanel = shell.querySelector(".copy-panel");
          const built = trajectoireWordsHtml(station.role, station.detail);
          if (roleEl) roleEl.innerHTML = built.roleHtml;
          if (detailEl) {
            if (built.detailHtml) {
              detailEl.innerHTML = built.detailHtml;
              detailEl.hidden = false;
            } else {
              detailEl.innerHTML = "";
              detailEl.hidden = true;
            }
          }
          if (cityEl) cityEl.textContent = station.place || station.institution || "";
          if (periodEl) periodEl.textContent = station.years || station.mark || "";
          if (copyPanel) copyPanel.setAttribute("aria-label", station.role || "");
          shell.dataset.name = station.place || station.institution || "";
          shell.dataset.stationIndex = String(trajectoireMod(stationIndex, TRAJECTOIRE_STATIONS.length));
          shell.dataset.logo = station.logo || "";
          shell.setAttribute(
            "aria-label",
            (station.role || "") + ". " + (station.years || "") + ". " + (station.institution || "") + ". Cliquez pour les détails."
          );
          card.videoUsable = false;
          card.imageReady = false;
          card.imageUsable = false;
          const logoUrl = station.logo || "";
          const applyLogo = (ok) => {
            try {
              card.imageReady = true;
              card.imageUsable = Boolean(ok && card.image && card.image.naturalWidth);
              trajectoireDrawLogo(card);
            } catch (err) {
              try {
                card.imageReady = true;
                card.imageUsable = false;
                trajectoireDrawFallbackMark(card);
              } catch (e2) {}
            }
          };
          card.image.onload = () => applyLogo(true);
          card.image.onerror = () => applyLogo(false);
          // Never CORS-taint — canvas drawImage needs a clean same-origin bitmap
          try {
            card.image.crossOrigin = null;
            card.image.removeAttribute("crossOrigin");
          } catch (e) {}
          let nextSrc = logoUrl;
          try {
            const base = (parent && parent.location && parent.location.href) || document.baseURI || window.location.href;
            const u = new URL(logoUrl, base);
            u.searchParams.set("t", String(stationIndex));
            nextSrc = u.href;
          } catch (e) {
            nextSrc = logoUrl + (logoUrl.includes("?") ? "&" : "?") + "t=" + stationIndex;
          }
          if (card.image.src === nextSrc) {
            if (card.image.complete && card.image.naturalWidth) applyLogo(true);
            else if (card.image.complete) applyLogo(false);
          } else {
            card.image.src = nextSrc;
            if (card.image.complete && card.image.naturalWidth) applyLogo(true);
          }
          parent.postMessage({
            koiStudies: {
              type: "index",
              index: trajectoireMod(trajectoireFront, TRAJECTOIRE_STATIONS.length),
              total: TRAJECTOIRE_STATIONS.length,
            },
          }, "*");
        } catch (err) {
          console.warn("bindTrajectoireCard", err);
        }
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
          try { bindTrajectoireCard(card, trajectoireFront + 2); } catch (err) { console.warn(err); }
          card.shell.style.transition = "none";`
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
        try { bindTrajectoireCard(incoming, trajectoireFront); } catch (err) { console.warn(err); }

        incoming.shell.style.transition = "none";`
  );

  // Longer, smoother fly-off (was 180ms + heavy blur — felt abrupt)
  next = next.replace(
    `const distance = Math.max(190, scene.getBoundingClientRect().width * 0.66);
        const duration = reducedMotion.matches ? 0 : 180;
        const incoming = cards[order[order.length - 2]];`,
    `const distance = Math.max(220, scene.getBoundingClientRect().width * 0.72);
        const duration = reducedMotion.matches ? 0 : 340;
        const incoming = cards[order[order.length - 2]];`,
  );

  next = next.replace(
    `card.dragPlane.style.setProperty(
          "--release-blur",
          duration ? "16px" : "0px"
        );`,
    `card.dragPlane.style.setProperty(
          "--release-blur",
          "0px"
        );`,
  );

  // Match previous-card reveal to the same spring timing
  next = next.replace(
    `const distance = Math.max(190, scene.getBoundingClientRect().width * 0.66);
        const duration = reducedMotion.matches ? 0 : 360;
        trajectoireFront -= 1;`,
    `const distance = Math.max(220, scene.getBoundingClientRect().width * 0.72);
        const duration = reducedMotion.matches ? 0 : 340;
        trajectoireFront -= 1;`,
  );

  // Easier swipe on full-bleed cards
  next = next.replace(
    `const getDragCommitThreshold = () =>
        clamp(scene.getBoundingClientRect().width * 0.18, 52, 88);`,
    `const getDragCommitThreshold = () =>
        clamp(scene.getBoundingClientRect().width * 0.1, 36, 64);`,
  );

  // Tap opens detail; short horizontal flick still navigates
  next = next.replace(
    `        } else if (isTap) {
          sendToBack(card, x || 1, y);
        } else {
          setShellTransform(card);
        }`,
    `        } else if (isTap) {
          if (typeof TRAJECTOIRE_STATIONS !== "undefined") {
            const idx = trajectoireMod(
              Number(card.shell.dataset.stationIndex || trajectoireFront),
              TRAJECTOIRE_STATIONS.length
            );
            card.shell.classList.add("is-opening");
            parent.postMessage({ koiStudies: { type: "open", index: idx } }, "*");
            window.setTimeout(() => card.shell.classList.remove("is-opening"), 520);
            setShellTransform(card);
          } else {
            sendToBack(card, x || 1, y);
          }
        } else if (typeof TRAJECTOIRE_STATIONS !== "undefined" && Math.abs(x) > Math.abs(y) * 0.7 && Math.abs(x) > 18) {
          transitioning = false;
          if (x < 0) sendToBack(card, 1, 0);
          else bringPreviousToFront();
        } else {
          setShellTransform(card);
        }`,
  );

  // Never leave the deck locked if settle throws
  next = next.replace(
    `transitioning = false;

          if (hadFocus) incoming.shell.focus({ preventScroll: true });
        }, duration);
      };

      const bringPreviousToFront = () => {`,
    `transitioning = false;
          } catch (err) {
            console.warn("sendToBack settle", err);
            transitioning = false;
          }

          try { if (hadFocus) incoming.shell.focus({ preventScroll: true }); } catch (e) {}
        }, duration);
      };

      const bringPreviousToFront = () => {`,
  );

  // Wrap sendToBack settle start in try
  next = next.replace(
    `window.setTimeout(() => {
          const hadFocus = document.activeElement === card.shell;
          order = [card.id, ...order.filter(id => id !== card.id)];
          trajectoireFront += 1;
          try { bindTrajectoireCard(card, trajectoireFront + 2); } catch (err) { console.warn(err); }
          card.shell.style.transition = "none";`,
    `window.setTimeout(() => {
          let hadFocus = false;
          try {
          hadFocus = document.activeElement === card.shell;
          order = [card.id, ...order.filter(id => id !== card.id)];
          trajectoireFront += 1;
          try { bindTrajectoireCard(card, trajectoireFront + 2); } catch (err) { console.warn(err); }
          card.shell.style.transition = "none";`,
  );

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
              card.shell.classList.add("is-opening");
              parent.postMessage({ koiStudies: { type: "open", index: idx } }, "*");
              window.setTimeout(() => card.shell.classList.remove("is-opening"), 520);
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

  // Original once-load/error handlers race with logo rebind — neutralize for Trajectoire
  next = next.replace(
    `card.image.addEventListener("load", () => {
          card.imageReady = true;
          card.imageUsable = true;
          drawStatic(card);
          startInitialPixelReveal();
          syncAnimation();
        }, { once: true });

        card.image.addEventListener("error", () => {
          card.imageReady = true;
          card.context.fillStyle = card.panelColor;
          card.context.fillRect(0, 0, WIDTH, HEIGHT);
          startInitialPixelReveal();
          syncAnimation();
        }, { once: true });`,
    `card.image.addEventListener("load", () => {
          if (typeof TRAJECTOIRE_STATIONS !== "undefined") return;
          card.imageReady = true;
          card.imageUsable = true;
          drawStatic(card);
          startInitialPixelReveal();
          syncAnimation();
        }, { once: true });

        card.image.addEventListener("error", () => {
          if (typeof TRAJECTOIRE_STATIONS !== "undefined") return;
          card.imageReady = true;
          card.context.fillStyle = card.panelColor;
          card.context.fillRect(0, 0, WIDTH, HEIGHT);
          startInitialPixelReveal();
          syncAnimation();
        }, { once: true });`,
  );

  next = next.replace(
    `card.image.src = IMAGE_DATA[card.id];
        card.video.src = VIDEO_DATA[card.id];
        card.video.load();
      }`,
    `if (typeof TRAJECTOIRE_STATIONS === "undefined") {
          card.image.src = IMAGE_DATA[card.id];
          card.video.src = VIDEO_DATA[card.id];
          card.video.load();
        } else {
          card.videoUsable = false;
          // Logos loaded via bindTrajectoireCard after the loop (avoids once-load race)
        }
      }`,
  );

  next = next.replace(
    'window.addEventListener("keydown", handleGlobalKeyDown);',
    `window.addEventListener("keydown", handleGlobalKeyDown);
      window.__koiStudies = {
        next: () => { transitioning = false; sendToBack(topCard(), 1, 0); },
        prev: () => { transitioning = false; bringPreviousToFront(); },
      };
      window.addEventListener("message", (event) => {
        if (event.source !== parent) return;
        const msg = event.data && event.data.koiStudies;
        if (!msg) return;
        transitioning = false;
        if (msg.type === "next") sendToBack(topCard(), 1, 0);
        if (msg.type === "prev") bringPreviousToFront();
      });
      parent.postMessage({
        koiStudies: { type: "index", index: 0, total: TRAJECTOIRE_STATIONS.length },
      }, "*");
      // Bind logos after listeners exist — do not paint blank before load
      if (typeof TRAJECTOIRE_STATIONS !== "undefined") {
        cards.forEach((card, i) => {
          try { bindTrajectoireCard(card, i); } catch (err) { console.warn(err); }
        });
      }`,
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

  let html = String(originalHtml).replace(/\r\n/g, '\n');

  // StorageImage auto-sets crossOrigin=anonymous on same-origin URLs.
  // In srcDoc that taints the canvas (no ACAO) → drawImage fails → blank logos.
  html = html.replace(
    /function __threeuiStorageImage\([\s\S]*?return image;\}/,
    'function __threeuiStorageImage(...args){return new Image(...args);}',
  );

  // Never enable reveal ghosting / blur stack on Trajectoire cards
  html = html.replace(
    'scene.classList.add("reveal-enabled");',
    '/* chalh: no reveal-enabled — plain readable copy */',
  );

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
    `/* chalh trajectoire — clean stack, mono logos, no reveal ghosting */
    #fluid-pastels-background { display: none !important; }
    html, body {
      background: var(--field) !important;
    }
    html, body {
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
    }
    .stack-scene {
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      aspect-ratio: auto !important;
      transform: none !important;
      margin: 0 !important;
    }
    .stack,
    .stack-shell,
    .drag-plane,
    .artwork {
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
    }
    @media (max-width: 720px) {
      .stack-scene {
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
      }
    }
    .stack-shell.is-opening .artwork {
      transform: scale(1.04) translateY(-1.5%);
      box-shadow: 0 2.4cqw 5.5cqw rgb(0 0 0 / 0.32) !important;
      transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.42s ease;
    }
    .image-field {
      background: transparent !important;
    }
    .drag-plane,
    .stack-shell {
      background: transparent !important;
      box-shadow: none !important;
    }
    .artwork {
      border-radius: 1.2cqw !important;
      box-shadow: 0 1.4cqw 3.6cqw rgb(0 0 0 / 0.22) !important;
      outline: none !important;
      border: 0 !important;
      background: var(--panel) !important;
      overflow: hidden !important;
    }
    .image-field {
      inset: 0 0 auto !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: auto !important;
      width: 100% !important;
      height: 58% !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: contain !important;
      z-index: 1 !important;
      pointer-events: none !important;
    }
    .copy-panel {
      inset: 58% 0 0 !important;
      z-index: 2 !important;
      pointer-events: none !important;
    }
    .stack-shell,
    .drag-plane,
    .artwork {
      pointer-events: auto !important;
      touch-action: none !important;
    }
    .artwork::before,
    .artwork::after,
    .copy-panel::before {
      content: none !important;
      display: none !important;
      animation: none !important;
      opacity: 0 !important;
    }
    /* Kill original absolute + reveal stacking (was overlapping role/detail) */
    .word-reveal,
    .reveal-word,
    .reveal-lockup {
      display: inline !important;
      position: static !important;
      opacity: 1 !important;
      filter: none !important;
      translate: none !important;
      scale: none !important;
      transform: none !important;
      animation: none !important;
      will-change: auto !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    .stack-scene.reveal-enabled .reveal-word,
    .stack-scene.reveal-enabled .reveal-lockup,
    .stack-scene.reveal-enabled .stack-shell.is-active .reveal-word,
    .stack-scene.reveal-enabled .stack-shell.is-active .reveal-lockup {
      opacity: 1 !important;
      filter: none !important;
      translate: none !important;
      scale: none !important;
      animation: none !important;
    }
    .hanko,
    .brand-lockup,
    .wordmark {
      display: none !important;
    }
    .copy-panel {
      box-shadow: none !important;
      padding: 2.4cqw 5.5% 3.2cqw !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-start !important;
      align-items: stretch !important;
      gap: 0.7cqw !important;
      background: color-mix(in srgb, var(--panel) 96%, transparent) !important;
    }
    .copy,
    .copy--role,
    .copy--detail,
    .copy--meta {
      position: static !important;
      top: auto !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      margin: 0 !important;
      font-family: "Geist", Inter, ui-sans-serif, system-ui, sans-serif !important;
      font-style: normal !important;
      letter-spacing: -0.028em !important;
      text-wrap: pretty;
      opacity: 1 !important;
      filter: none !important;
      animation: none !important;
    }
    .copy--role {
      font-size: clamp(3.2cqw, 3.9cqw, 4.5cqw) !important;
      font-weight: 700 !important;
      line-height: 1.16 !important;
      color: var(--ink) !important;
    }
    .copy--detail {
      font-size: clamp(2cqw, 2.4cqw, 2.8cqw) !important;
      font-weight: 500 !important;
      line-height: 1.32 !important;
      color: var(--ink) !important;
      opacity: 0.7 !important;
      max-width: 94%;
    }
    .copy--meta {
      margin-top: 0.85cqw !important;
      font-size: clamp(2.35cqw, 2.85cqw, 3.3cqw) !important;
      font-weight: 650 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.25 !important;
      color: var(--ink) !important;
      opacity: 0.88 !important;
    }
    .meta-period {
      opacity: 0.78;
      font-variant-numeric: tabular-nums;
    }
    .stack-shell {
      cursor: pointer;
      transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1) !important;
    }
    .drag-plane {
      transition:
        transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity 260ms cubic-bezier(0.22, 1, 0.36, 1) !important;
      filter: none !important;
    }
    .stack-shell.is-tracking .drag-plane {
      transition-duration: 48ms !important;
      transition-timing-function: linear !important;
    }
    .stack-shell.is-dragging .drag-plane {
      transition: none !important;
    }
    .stack-shell.is-releasing .drag-plane {
      transition:
        transform 340ms cubic-bezier(0.16, 1, 0.3, 1),
        opacity 280ms cubic-bezier(0.22, 1, 0.36, 1) !important;
      filter: none !important;
    }
    .artwork {
      transition:
        transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1) !important;
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
