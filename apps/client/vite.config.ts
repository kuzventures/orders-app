import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/client',
  envDir: '.',
  server: { port: 4200, host: 'localhost' },
  preview: { port: 4300, host: 'localhost' },
  resolve: {
    alias: {},
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    outDir: path.resolve(__dirname, '../../../dist/apps/client'), // <-- point to client folder
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
