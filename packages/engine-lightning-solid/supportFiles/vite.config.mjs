import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { importChunkUrl } from '@lightningjs/vite-plugin-import-chunk-url';

export default defineConfig({
  plugins: [importChunkUrl(), solidPlugin({
    solid: {
      moduleName: "@lightningjs/solid",
      generate: 'universal',
    },
  })],
  resolve: {
    dedupe: ['solid-js'],
  },
  optimizeDeps: {
    include: [],
    exclude: ['@lightningjs/solid', '@lightningjs/renderer/core', '@lightningjs/renderer/workers/renderer']
  },
  server: {
    hmr: false,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
