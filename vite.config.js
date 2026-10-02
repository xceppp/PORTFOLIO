import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Slow Halftone Flow clock inside the packaged nexus-unified-flow source. */
function slowHalftoneFlow() {
  const TIME_SCALE = '0.32'
  const SHADER_SCALE = '0.14'
  return {
    name: 'slow-halftone-flow',
    transform(code, id) {
      const normalized = id.replace(/\\/g, '/')
      if (!normalized.includes('nexus-unified-flow.html')) return null
      let next = code
      next = next.replace(
        'gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000.0);',
        `gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000.0 * ${TIME_SCALE});`,
      )
      // Idempotent if node_modules already patched
      next = next.replace(
        'gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000.0 * 0.32);',
        `gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000.0 * ${TIME_SCALE});`,
      )
      next = next.replace(
        'float time = u_time * 0.4;',
        `float time = u_time * ${SHADER_SCALE};`,
      )
      next = next.replace(
        'float time = u_time * 0.14;',
        `float time = u_time * ${SHADER_SCALE};`,
      )
      return next === code ? null : next
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), slowHalftoneFlow()],
  optimizeDeps: {
    // Keep Halftone source out of the esbuild prebundle so the speed transform runs.
    exclude: ['@designcodeio/threeui'],
  },
})
