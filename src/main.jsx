import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@designcodeio/threeui/style.css';
import { ThemeProvider } from './hooks/useTheme';
import App from './App.jsx';

// Warm the entry Halftone chunk during bootstrap so the hero bg isn't empty.
void import('@designcodeio/threeui/components/PredictiveArcCanvas');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
