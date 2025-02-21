import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  cacheDir: '.vite-cache',
  plugins: [react(), compression({ algorithm: 'brotliCompress' })],
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, 'src'),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('images')) return 'images';

          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('lodash') || id.includes('axios')) return 'utils-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
});
