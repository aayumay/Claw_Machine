// ============================================================
// Entry Point — main.tsx
// ============================================================
// Renders App WITHOUT StrictMode to avoid Phaser double-init.

import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(<App />);
