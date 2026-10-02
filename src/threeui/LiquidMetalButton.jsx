import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import originalSource from './sources/liquid-metal-button.html?raw';

/**
 * Exact ThreeUI LiquidMetalButton — Sign up Pill (`pill`).
 * Source revision SHA-256 76624e881a3a — liquid-metal-button.html.
 */

const BRIDGE = `
<script id="liquid-metal-button-bridge">
  window.addEventListener('message', event => {
    if(event.source !== parent) return;
    const config = event.data && event.data.liquidMetalButton;
    if(!config) return;
    const text = typeof config.text === 'string' ? config.text.slice(0, 24) : '';
    const label = btn.querySelector('.lbl');
    if(label) label.textContent = text;
    btn.setAttribute('aria-label', text || 'Button');
    if(Number.isFinite(config.pillWidthUnits)) {
      stage.style.setProperty('--bw', 'calc(' + config.pillWidthUnits + ' * var(--u))');
    }
    if (typeof config.stageBackground === 'string') {
      document.body.style.background = config.stageBackground;
      document.documentElement.style.background = config.stageBackground;
      document.body.style.backgroundColor = config.stageBackground;
      document.documentElement.style.backgroundColor = config.stageBackground;
    } else if (config.embedded) {
      document.body.style.background = 'transparent';
      document.documentElement.style.background = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
    } else {
      document.body.style.background = '';
      document.documentElement.style.background = '';
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    }
    if (config.embedded) {
      stage.style.position = 'absolute';
      stage.style.inset = '0';
      stage.style.top = '0';
      stage.style.left = '0';
      stage.style.transform = 'none';
      stage.style.width = '100%';
      stage.style.height = '100%';
      stage.style.setProperty('--pad', '0px');
      stage.style.setProperty('--bw', '100%');
      stage.style.setProperty('--bh', '100%');
    } else {
      stage.style.position = '';
      stage.style.inset = '';
      stage.style.top = '';
      stage.style.left = '';
      stage.style.transform = '';
      stage.style.width = '';
      stage.style.height = '';
    }
  });

  btn.addEventListener('click', () => {
    parent.postMessage({ liquidMetalButton: { type: 'activate' } }, '*');
  });
<\/script>`;

function stageBackground(theme, embedded) {
  if (embedded) return 'transparent';
  if (theme === 'light') {
    return `radial-gradient(46vmax 32vmax at 50% 47%,
      #ffffff 0%, #f4f5f3 34%, #e7e9e5 62%, #dfe2de 88%) #f4f5f3`;
  }
  return `radial-gradient(46vmax 32vmax at 50% 47%,
      #191b21 0%, #0e0f13 34%, #050506 62%, #000 88%) #000`;
}

function buildPillDocument(theme, embedded, label = 'Sign up') {
  let html = originalSource;
  const bg = stageBackground(theme, embedded);
  const safeLabel = String(label || 'Sign up').slice(0, 24);
  html = html.replace(
    /background:\s*radial-gradient\(46vmax 32vmax at 50% 47%,\s*#191b21 0%, #0e0f13 34%, #050506 62%, #000 88%\) #000;/,
    `background: ${bg};`,
  );
  // Bake label into srcDoc so CTAs never flash the default "Sign up"
  html = html.replace(
    /<span class="lbl">Sign up<\/span>/,
    `<span class="lbl">${safeLabel.replace(/</g, '&lt;')}</span>`,
  );
  if (embedded) {
    html = html
      .replace(
        'html,body{height:100%}',
        'html,body{height:100%;background:transparent!important}',
      )
      .replace(
        '<body>',
        `<body style="background:transparent" data-embedded="true">
<style id="liquid-metal-embedded">
  html,body{
    background:transparent!important;
    background-color:transparent!important;
    overflow:hidden!important;
  }
  .stage{
    --h: 30px;
    --pad: 0px;
    --bw: 100%;
    --bh: 100%;
    position: absolute !important;
    inset: 0 !important;
    top: 0 !important;
    left: 0 !important;
    transform: none !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 999px !important;
    overflow: hidden !important;
    background: transparent !important;
  }
  .plate{
    /* Host CSS draws the pill body; hide the in-iframe plate */
    display: none !important;
  }
  .btn{
    width: 100% !important;
    height: 100% !important;
  }
  .lbl{
    font-size: 12px !important;
    letter-spacing: 0.01em !important;
    padding: 0 0.75em !important;
  }
  #fx{
    border-radius: 999px !important;
    background: transparent !important;
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' preserveAspectRatio='none'%3E%3Crect width='100' height='40' rx='20' fill='%23fff'/%3E%3C/svg%3E");
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' preserveAspectRatio='none'%3E%3Crect width='100' height='40' rx='20' fill='%23fff'/%3E%3C/svg%3E");
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
  }
</style>`,
      )
      // Transparent default framebuffer clear before compositing the pill
      .replace(
        'function drawTo(t){\n  gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fbo : null);\n  gl.viewport(0, 0, t ? t.w : W, t ? t.h : H);\n  gl.drawArrays(gl.TRIANGLES, 0, 3);\n}',
        `function drawTo(t){
  gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fbo : null);
  gl.viewport(0, 0, t ? t.w : W, t ? t.h : H);
  if(!t){ gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); }
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}`,
      )
      // Force coverage alpha from the pill SDF so iframe corners stay transparent
      .replace(
        'float a = clamp(max(rgb.r, max(rgb.g, rgb.b)), 0., 1.);\n  o = vec4(min(rgb, vec3(1.)), a);',
        'float a = clamp(max(rgb.r, max(rgb.g, rgb.b)), 0., 1.) * pill;\n  o = vec4(min(rgb, vec3(1.)) * pill, a);',
      );
  }
  if (!html.includes('id="liquid-metal-button-bridge"')) {
    html = html.includes('</body>')
      ? html.replace('</body>', `${BRIDGE}\n</body>`)
      : `${html}${BRIDGE}`;
  }
  return html;
}

export function LiquidMetalButton({
  className = '',
  variant = 'pill',
  text,
  embedded = false,
  theme = 'dark',
  onClick,
}) {
  const hostRef = useRef(null);
  const frameRef = useRef(null);
  const visibleRef = useRef(true);
  const [hostVisible, setHostVisible] = useState(true);
  const [ready, setReady] = useState(false);

  const shape = variant === 'pill' ? 'pill' : 'pill';
  const label = String(text ?? 'Sign up').slice(0, 24);
  const pillWidthUnits = Math.min(3000, Math.max(1407, 820 + label.length * 94));
  const srcDoc = useMemo(
    () => buildPillDocument(theme, embedded, label),
    [theme, embedded, label],
  );
  const canvas = embedded ? 'transparent' : theme === 'light' ? '#f4f5f3' : '#070708';

  const pushConfig = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      {
        liquidMetalButton: {
          text: label,
          pillWidthUnits,
          embedded,
          stageBackground: stageBackground(theme, embedded),
        },
      },
      '*',
    );
  }, [embedded, label, pillWidthUnits, theme]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === 'undefined') return undefined;
    const update = () => setHostVisible(visibleRef.current && document.visibilityState !== 'hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
        update();
      },
      { rootMargin: '80px' },
    );
    observer.observe(host);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    setReady(false);
  }, [theme, srcDoc]);

  useEffect(() => {
    if (!ready) return;
    pushConfig();
  }, [ready, pushConfig]);

  useEffect(() => {
    if (!onClick) return undefined;
    const onMessage = (event) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.liquidMetalButton?.type === 'activate') onClick();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onClick]);

  return (
    <div
      ref={hostRef}
      className={`liquid-metal-button${className ? ` ${className}` : ''}`}
      data-state={!hostVisible ? 'paused' : ready ? 'ready' : 'loading'}
      data-variant={shape}
      data-theme={theme}
      style={{ background: canvas }}
    >
      {hostVisible ? (
        <iframe
          key={theme}
          ref={frameRef}
          className={`liquid-metal-button__frame${ready ? ' is-ready' : ''}`}
          title="Interactive liquid metal button"
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => {
            setReady(true);
            pushConfig();
          }}
          style={{ background: canvas }}
        />
      ) : null}
    </div>
  );
}

export default LiquidMetalButton;
