import config from '../renative.engine.json';

const eExt = config.engineExtension;
const ex = ext => [
    `${ext}.${eExt}.jsx`, `${ext}.jsx`, `${ext}.${eExt}.js`, `${ext}.js`,
    `${ext}.${eExt}.tsx`, `${ext}.tsx`, `${ext}.${eExt}.ts`, `${ext}.ts`
];
const EXT_FALLBACK = ['jsx', 'js', 'json', 'wasm', 'tsx', 'ts'];

export const PLATFORMS = {
    macos: {
        defaultPort: 8086,
        extenstions: [
            ...ex(config.id), ...ex('macos.desktop'), ...ex('desktop'), ...ex('macos'), ...ex('desktop.web'), ...ex('electron'), ...ex('web'), ...EXT_FALLBACK
        ]
    },
    windows: {
        defaultPort: 8092,
        extenstions: [
            ...ex(config.id), ...ex('windows.desktop'), ...ex('desktop'), ...ex('windows'), ...ex('desktop.web'), ...ex('electron'), ...ex('web'), ...EXT_FALLBACK
        ]
    }
};
