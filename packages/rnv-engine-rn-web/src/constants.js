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
        isWebHosted: true,
        extenstions: [
            ...ex(config.id), ...ex('web.browser'), ...ex('browser'), ...ex('server.next'), ...ex('server.web'), ...ex('next'), ...ex('browser.web'), ...ex('web'), ...EXT_FALLBACK
        ]
    },
    chromecast: {
        defaultPort: 8095,
        isWebHosted: true,
        extenstions: [
            ...ex(config.id), ...ex('chromecast.tv'), ...ex('web.tv'), ...ex('tv'), ...ex('chromecast'), ...ex('tv.web'), ...ex('web'), ...EXT_FALLBACK
        ]
    },
    tizen: {
        defaultPort: 8087,
        isWebHosted: true,
        extenstions: [
            ...ex(config.id), ...ex('tizen.tv'), ...ex('web.tv'), ...ex('tv'), ...ex('tizen'), ...ex('tv.web'), ...ex('web'), ...EXT_FALLBACK
        ]
    },
    tizenmobile: {
        defaultPort: 8091,
        isWebHosted: true,
        extenstions: [
            ...ex(config.id), ...ex('tizenmobile.mobile'), ...ex('mobile'), ...ex('tizenmobile'), ...ex('mobile.web'), ...ex('native'), ...EXT_FALLBACK
        ]
    },
    tizenwatch: {
        defaultPort: 8090,
        isWebHosted: true,
        extenstions: [
            ...ex(config.id), ...ex('tizenwatch.watch'), ...ex('web.watch'), ...ex('watch'), ...ex('tizenwatch'), ...ex('watch.web'), ...ex('web'), ...EXT_FALLBACK
        ]
    },
    webos: {
        defaultPort: 8088,
        isWebHosted: true,
        extenstions: [
            ...ex(config.id), ...ex('webos.tv'), ...ex('web.tv'), ...ex('tv'), ...ex('webos'), ...ex('tv.web'), ...ex('web'), ...EXT_FALLBACK
        ]
    },
    firefoxos: {
        defaultPort: 8094,
        isWebHosted: true,
        extenstions: [
            ...ex(config.id), ...ex('firefoxos.mobile'), ...ex('mobile'), ...ex('firefoxos'), ...ex('mobile.web'), ...ex('native'), ...EXT_FALLBACK
        ]
    },
    firefoxtv: {
        defaultPort: 8014,
        isWebHosted: true,
        extenstions: [
            ...ex(config.id), ...ex('firefoxtv.tv'), ...ex('web.tv'), ...ex('tv'), ...ex('firefoxtv'), ...ex('tv.web'), ...ex('web'), ...EXT_FALLBACK
        ]
    },
    kaios: {
        defaultPort: 8093,
        isWebHosted: true,
        extenstions: [
            ...ex(config.id), ...ex('kaios.mobile'), ...ex('mobile'), ...ex('kaios'), ...ex('mobile.web'), ...ex('native'), ...EXT_FALLBACK
        ]
    }
};
