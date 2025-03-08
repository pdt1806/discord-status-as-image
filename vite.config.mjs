import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  cacheDir: '.vite-cache',
  plugins: [react(), compression({ algorithm: 'brotliCompress' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('images')) return 'images';
          if (id.includes('node_modules')) {
            if (id.includes('@tabler/icons-react')) return 'tabler-icons-vendor';
            if (id.includes('@mantine/core')) return 'mantine-core-vendor';
            if (id.includes('@mantine/notifications')) return 'mantine-notifications-vendor';
            if (id.includes('@mantine/form')) return 'mantine-form-vendor';
            if (id.includes('@mantine/hooks')) return 'mantine-hooks-vendor';
            if (id.includes('pocketbase')) return 'pocketbase-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
});
