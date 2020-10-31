import config from '../renative.engine.json';

const eExt = config.engineExtension;
const ex = ext => [
    `${ext}.${eExt}.jsx`, `${ext}.jsx`, `${ext}.${eExt}.js`, `${ext}.js`,
    `${ext}.${eExt}.tsx`, `${ext}.tsx`, `${ext}.${eExt}.ts`, `${ext}.ts`
];
const EXT_FALLBACK = ['mjs', 'jsx', 'js', 'json', 'wasm', 'tsx', 'ts'];

export const PLATFORMS = {
    web: {
        defaultPort: 8080,
        extenstions: [
            ...ex(config.id), ...ex('web.browser'), ...ex('browser'), ...ex('server.next'), ...ex('server.web'), ...ex('next'), ...ex('browser.web'), ...ex('web'), ...EXT_FALLBACK
        ]
    },
    chromecast: {
        defaultPort: 8095,
        extenstions: [
            ...ex(config.id), ...ex('chromecast.tv'), ...ex('web.tv'), ...ex('tv'), ...ex('chromecast'), ...ex('tv.web'), ...ex('web'), ...EXT_FALLBACK
        ]
    }
};
