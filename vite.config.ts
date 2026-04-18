import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Run `vercel dev` on port 3001 for /api/* routes in development.
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          },
        },
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
      },
      build: {
        target: 'es2020',
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'animation': ['framer-motion'],
            },
          },
        },
      },
    };
});
