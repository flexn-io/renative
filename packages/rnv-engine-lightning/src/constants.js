import CONFIG from '../renative.engine.json';

const eExt = CONFIG.engineExtension;
const ex = ext => [
    `${ext}.${eExt}.jsx`, `${ext}.jsx`, `${ext}.${eExt}.js`, `${ext}.js`,
    `${ext}.${eExt}.tsx`, `${ext}.tsx`, `${ext}.${eExt}.ts`, `${ext}.ts`
];
const EXT_FALLBACK = ['jsx', 'js', 'json', 'wasm', 'tsx', 'ts'];

export const PLATFORMS = {
    tizen: {
        defaultPort: 8086,
        isWebHosted: true,
        extenstions: [
            ...ex(CONFIG.id), ...ex('macos.desktop'), ...ex('desktop'), ...ex('macos'), ...ex('desktop.web'), ...ex('electron'), ...ex('web'), ...EXT_FALLBACK
        ]
    },
    webos: {
        defaultPort: 8092,
        isWebHosted: true,
        extenstions: [
            ...ex(CONFIG.id), ...ex('windows.desktop'), ...ex('desktop'), ...ex('windows'), ...ex('desktop.web'), ...ex('electron'), ...ex('web'), ...EXT_FALLBACK
        ]
    }
};

export {
    CONFIG
};
