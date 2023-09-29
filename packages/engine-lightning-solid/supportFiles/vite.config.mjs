import { importChunkUrl } from '@lightningjs/vite-plugin-import-chunk-url';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
    plugins: [
        importChunkUrl(),
        solidPlugin({
            solid: {
                moduleName: '@lightningjs/solid',
                generate: 'universal',
            },
        }),
    ],
    resolve: {
        dedupe: ['solid-js'],
        extensions: process.env.RNV_EXTENSIONS.split(',').map((e) => `.${e}`),
    },
    optimizeDeps: {
        include: [],
        exclude: ['@lightningjs/solid', '@lightningjs/renderer/core', '@lightningjs/renderer/workers/renderer'],
    },
    server: {
        hmr: false,
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    },
});
