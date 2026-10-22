import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{html,ts,tsx,scss}',
    './index.tsx'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Refined Industrial palette
        void: '#020617',
        surface: '#050510',
        panel: '#0f1020',
        signal: '#22d3ee',
        signalSoft: '#67e8f9',
        orchid: '#a78bfa'
      },
      fontFamily: {
        heading: ['"Orbitron"', '"Share Tech Mono"', 'monospace'],
        display: ['"Orbitron"', 'monospace'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        terminal: ['"Share Tech Mono"', '"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #22d3ee, 0 0 10px rgba(34, 211, 238, 0.4), 0 0 20px rgba(34, 211, 238, 0.2)',
        'panel-glow': '0 0 40px -12px rgba(34, 211, 238, 0.35)',
        'orbital': '0 0 60px -20px rgba(167, 139, 250, 0.4)'
      }
    }
  },
  plugins: []
};

export default config;
