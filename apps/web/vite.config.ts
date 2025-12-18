import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Map @minecraft-assets/ui to source for tree-shaking
      '@minecraft-assets/ui/sounds': resolve(
        __dirname,
        '../../packages/ui/src/sounds'
      ),
      '@minecraft-assets/ui': resolve(__dirname, '../../packages/ui/src'),
    },
  },
  build: {
    // Ensure sounds are copied with hashed names for cache busting
    assetsInlineLimit: 0, // Don't inline any assets (sounds stay as files)
    rollupOptions: {
      // Enable tree-shaking for sound imports
      treeshake: {
        moduleSideEffects: false,
      },
      output: {
        // Keep asset names readable
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  // Optimize deps to handle the ?url imports
  optimizeDeps: {
    include: ['react', 'react-dom'],
    // Don't pre-bundle the UI package so tree-shaking works properly
    exclude: ['@minecraft-assets/ui'],
  },
});
