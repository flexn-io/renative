import config from '../renative.engine.json';

const eExt = config.engineExtension;
const ex = ext => [
    `${ext}.${eExt}.jsx`, `${ext}.jsx`, `${ext}.${eExt}.js`, `${ext}.js`,
    `${ext}.${eExt}.tsx`, `${ext}.tsx`, `${ext}.${eExt}.ts`, `${ext}.ts`
];
const EXT_FALLBACK = ['jsx', 'js', 'json', 'wasm', 'tsx', 'ts'];

export const PLATFORMS = {
    ios: {
        defaultPort: 8082,
        extenstions: [
            ...ex(config.id), ...ex('ios.mobile'), ...ex('mobile'), ...ex('ios'), ...ex('mobile.native'), ...ex('native'), ...EXT_FALLBACK
        ]
    },
    android: {
        defaultPort: 8083,
        extenstions: [
            ...ex(config.id), ...ex('android.mobile'), ...ex('mobile'), ...ex('android'), ...ex('mobile.native'), ...ex('native'), ...EXT_FALLBACK
        ]
    },
    androidtv: {
        defaultPort: 8084,
        extenstions: [
            ...ex(config.id), ...ex('androidtv.tv'), ...ex('tv'), ...ex('androidtv'), ...ex('android'), ...ex('tv.native'), ...ex('native'), ...EXT_FALLBACK
        ]
    },
    androidwear: {
        defaultPort: 8084,
        extenstions: [
            ...ex(config.id), ...ex('androidwear.watch'), ...ex('watch'), ...ex('androidwear'), ...ex('android'), ...ex('watch.native'), ...ex('native'), ...EXT_FALLBACK
        ]
    },
    tvos: {
        defaultPort: 8089,
        extenstions: [
            ...ex(config.id), ...ex('tvos.tv'), ...ex('tv'), ...ex('tvos'), ...ex('ios'), ...ex('tv.native'), ...ex('native'), ...EXT_FALLBACK
        ]
    }
};
