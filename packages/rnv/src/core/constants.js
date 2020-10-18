// PLATFORM
import { homedir } from 'os';
import path from 'path';

export const USER_HOME_DIR = homedir();
export const RNV_HOME_DIR = path.join(__dirname, '../..');
export const CURRENT_DIR = path.resolve('.');
export const RNV_NODE_MODULES_DIR = path.join(RNV_HOME_DIR, 'node_modules');
export const RNV_PROJECT_DIR_NAME = 'project';
export const RNV_SERVER_DIR_NAME = 'server';

export const ANDROID = 'android';
export const ANDROID_AUTO = 'androidauto';
export const ANDROID_TV = 'androidtv';
export const ANDROID_WEAR = 'androidwear';
export const ALEXA = 'alexa';
export const APPLE_AUTO = 'appleauto';
export const ASTIAN = 'astian';
export const BLACKBERRY = 'blackberry';
export const CHROMECAST = 'chromecast';
export const CHROME_OS = 'chromeos';
export const FIREFOX_OS = 'firefoxos';
export const FIREFOX_TV = 'firefoxtv';
export const FIRE_OS = 'fireos';
export const FIRE_TV = 'firetv';
export const HBBTV = 'hbbtv';
export const IOS = 'ios';
export const KAIOS = 'kaios';
export const MACOS = 'macos';
export const MEEGO = 'meego';
export const NETCAST = 'netcast';
export const OCCULUS = 'occulus';
export const ORSAY = 'orsay';
export const PS4 = 'ps4';
export const ROKU = 'roku';
export const SAILFISH = 'sailfish';
export const TIVO = 'tivo';
export const TIZEN = 'tizen';
export const TIZEN_WATCH = 'tizenwatch';
export const TIZEN_MOBILE = 'tizenmobile';
export const TVOS = 'tvos';
export const UBUNTU = 'ubuntu';
export const UBUNTU_TOUCH = 'ubuntutouch';
export const UNITY = 'unity';
export const VEWD = 'vewd';
export const VIDAA = 'vidaa';
export const VIERACONNECT = 'vieraconnect';
export const VIZIO = 'vizio';
export const WATCHOS = 'watchos';
export const WEB = 'web';
export const WEBOS = 'webos';
export const WEBIAN = 'webian';
export const WII = 'wii';
export const WINDOWS = 'windows';
export const WP10 = 'wp10';
export const WP8 = 'wp8';
export const XBOX = 'xbox';
export const XBOX360 = 'xbox360';
// Kodi, Boxee, HorizonTV, Mediaroom(Ericsson), YahooSmartTV, Slingbox, Hololens, Occulus, GearVR, WebVR

export const ICONS = {
    PHONE: '📱',
    AUTO: '🚗',
    TV: '📺',
    CONSOLE: '🎮',
    WATCH: '⌚',
    DESKTOP: '🖥️ ',
    BROWSER: '🌐',
    VOICE: '📢',
    SERVICE: '☁️'
};

export const OS_WINDOWS = 'windows';
export const OS_MAC = 'mac';
export const OS_LINUX = 'linux';

export const OS = {
    ALL: [OS_MAC, OS_WINDOWS, OS_LINUX],
    MAC_ONLY: [OS_MAC],
    WINDOWS_ONLY: [OS_WINDOWS],
    LINUX_ONLY: [OS_LINUX]
};

const EXT_BROWSER = ['browser.jsx', 'browser.js', 'browser.tsx', 'browser.ts'];
const EXT_MOBILE = ['mobile.jsx', 'mobile.js', 'mobile.tsx', 'mobile.ts'];
const EXT_MOBILE_NATIVE = ['mobile.native.jsx', 'mobile.native.js', 'mobile.native.tsx', 'mobile.native.ts'];
const EXT_NATIVE = ['native.jsx', 'native.js', 'native.tsx', 'native.ts'];
const EXT_TV_NATIVE = ['tv.native.jsx', 'tv.native.js', 'tv.native.tsx', 'tv.native.ts'];
const EXT_IOS_MOBILE = ['ios.mobile.jsx', 'ios.mobile.js', 'ios.mobile.tsx', 'ios.mobile.ts'];
const EXT_IOS = ['ios.jsx', 'ios.js', 'ios.tsx', 'ios.ts'];
const EXT_ANDROID_MOBILE = ['android.mobile.jsx', 'android.mobile.js', 'android.mobile.tsx', 'android.mobile.ts'];
const EXT_ANDROID = ['android.jsx', 'android.js', 'android.tsx', 'android.ts'];
const EXT_TVOS = ['tvos.jsx', 'tvos.js', 'tvos.tsx', 'tvos.ts'];
const EXT_TVOS_TV = ['tvos.tv.jsx', 'tvos.tv.js', 'tvos.tv.tsx', 'tvos.tv.ts'];
const EXT_TV = ['tv.jsx', 'tv.js', 'tv.tsx', 'tv.ts'];
const EXT_ANDROIDTV_TV = ['androidtv.tv.jsx', 'androidtv.tv.js', 'androidtv.tv.tsx', 'androidtv.tv.ts'];
const EXT_ANDROIDTV = ['androidtv.jsx', 'androidtv.js', 'androidtv.tsx', 'androidtv.ts'];
const EXT_SERVER_WEB = ['server.web.jsx', 'server.web.js', 'server.web.tsx', 'server.web.ts'];
const EXT_WEB = ['web.jsx', 'web.js', 'web.tsx', 'web.ts'];
const EXT_MACOS_DESKTOP = ['macos.desktop.jsx', 'macos.desktop.js', 'macos.desktop.tsx', 'macos.desktop.ts'];
const EXT_DESKTOP = ['desktop.jsx', 'desktop.js', 'desktop.tsx', 'desktop.ts'];
const EXT_MACOS = ['macos.jsx', 'macos.js', 'macos.tsx', 'macos.ts'];
const EXT_DESKTOP_WEB = ['desktop.web.jsx', 'desktop.web.js', 'desktop.web.tsx', 'desktop.web.ts'];
const EXT_ELECTRON = ['electron.jsx', 'electron.js', 'electron.tsx', 'electron.ts'];
const EXT_TIZEN_TV = ['tizen.tv.jsx', 'tizen.tv.js', 'tizen.tv.tsx', 'tizen.tv.ts'];
const EXT_TIZEN = ['tizen.jsx', 'tizen.js', 'tizen.tsx', 'tizen.ts'];
const EXT_WEB_TV = ['web.tv.jsx', 'web.tv.js', 'web.tv.tsx', 'web.tv.ts'];
const EXT_TV_WEB = ['tv.web.jsx', 'tv.web.js', 'tv.web.tsx', 'tv.web.ts'];
const EXT_WEBOS_TV = ['webos.tv.jsx', 'webos.tv.js', 'webos.tv.tsx', 'webos.tv.ts'];
const EXT_WEBOS = ['webos.jsx', 'webos.js', 'webos.tsx', 'webos.ts'];
const EXT_ANDROIDWEAR_WATCH = ['androidwear.watch.jsx', 'androidwear.watch.js', 'androidwear.watch.tsx', 'androidwear.watch.ts'];
const EXT_ANDROIDWEAR = ['androidwear.jsx', 'androidwear.js', 'androidwear.tsx', 'androidwear.ts'];
const EXT_WATCH = ['watch.jsx', 'watch.js', 'watch.tsx', 'watch.ts'];
const EXT_WATCH_NATIVE = ['watch.native.jsx', 'watch.native.js', 'watch.native.tsx', 'watch.native.ts'];
const EXT_TIZENWATCH_WATCH = ['tizenwatch.watch.jsx', 'tizenwatch.watch.js', 'tizenwatch.watch.tsx', 'tizenwatch.watch.ts'];
const EXT_TIZENWATCH = ['tizenwatch.jsx', 'tizenwatch.js', 'tizenwatch.tsx', 'tizenwatch.ts'];
const EXT_WATCH_WEB = ['watch.web.jsx', 'watch.web.js', 'watch.web.tsx', 'watch.web.ts'];
const EXT_TIZENMOBILE_MOBILE = ['tizenmobile.mobile.jsx', 'tizenmobile.mobile.js', 'tizenmobile.mobile.tsx', 'tizenmobile.mobile.ts'];
const EXT_TIZENMOBILE = ['tizenmobile.jsx', 'tizenmobile.js', 'tizenmobile.tsx', 'tizenmobile.ts'];
const EXT_MOBILE_WEB = ['mobile.web.jsx', 'mobile.web.js', 'mobile.web.tsx', 'mobile.web.ts'];
const EXT_WIN_DESKTOP = ['windows.desktop.jsx', 'windows.desktop.js', 'windows.desktop.tsx', 'windows.desktop.ts'];
const EXT_WIN = ['windows.jsx', 'windows.js', 'windows.tsx', 'windows.ts'];
const EXT_KAIOS_MOBILE = ['kaios.mobile.jsx', 'kaios.mobile.js', 'kaios.mobile.tsx', 'kaios.mobile.ts'];
const EXT_KAIOS = ['kaios.jsx', 'kaios.js', 'kaios.tsx', 'kaios.ts'];
const EXT_FFOS_MOBILE = ['firefoxos.mobile.jsx', 'firefoxos.mobile.js', 'firefoxos.mobile.tsx', 'firefoxos.mobile.ts'];
const EXT_FFOS = ['firefoxos.jsx', 'firefoxos.js', 'firefoxos.tsx', 'firefoxos.ts'];
const EXT_FFTV_TV = ['firefoxtv.tv.jsx', 'firefoxtv.tv.js', 'firefoxtv.tv.tsx', 'firefoxtv.tv.ts'];
const EXT_FFTV = ['firefoxtv.jsx', 'firefoxtv.js', 'firefoxtv.tsx', 'firefoxtv.ts'];
const EXT_CAST_TV = ['chromecast.tv.jsx', 'chromecast.tv.js', 'chromecast.tv.tsx', 'chromecast.tv.ts'];
const EXT_CAST = ['chromecast.jsx', 'chromecast.js', 'chromecast.tsx', 'chromecast.ts'];
const EXT_FALLBACK_WEB = ['mjs', 'jsx', 'js', 'json', 'wasm', 'tsx', 'ts'];
const EXT_FALLBACK = ['jsx', 'js', 'json', 'wasm', 'tsx', 'ts'];


export const REMOTE_DEBUG_PORT = 8079;

const EXT_LEGACY_NEXT = ['next.jsx', 'next.js', 'next.tsx', 'next.ts'];
const EXT_LEGACY_SERVER_NEXT = ['server.next.jsx', 'server.next.js', 'server.next.tsx', 'server.next.ts'];


export const PLATFORMS = {
    // ACTIVE
    web: {
        defaultPort: 8080,
        icon: ICONS.BROWSER,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_BROWSER],
            platforms: [...EXT_LEGACY_SERVER_NEXT, ...EXT_SERVER_WEB, ...EXT_LEGACY_NEXT, ...EXT_WEB],
            fallbacks: [...EXT_FALLBACK_WEB]
        }
    },
    ios: {
        defaultPort: 8082,
        icon: ICONS.PHONE,
        supportedOS: OS.MAC_ONLY,
        isActive: true,
        sourceExts: {
            factors: [...EXT_IOS_MOBILE, ...EXT_MOBILE],
            platforms: [...EXT_IOS],
            fallbacks: [...EXT_MOBILE_NATIVE, ...EXT_NATIVE, ...EXT_FALLBACK]
        }
    },
    android: {
        defaultPort: 8083,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_ANDROID_MOBILE, ...EXT_MOBILE],
            platforms: [...EXT_ANDROID],
            fallbacks: [...EXT_MOBILE_NATIVE, ...EXT_NATIVE, ...EXT_FALLBACK]
        }
    },
    androidtv: {
        defaultPort: 8084,
        icon: ICONS.TV,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_ANDROIDTV_TV, ...EXT_TV],
            platforms: [...EXT_ANDROIDTV, ...EXT_ANDROID],
            fallbacks: [...EXT_TV_NATIVE, ...EXT_NATIVE, ...EXT_FALLBACK]
        }
    },
    tvos: {
        defaultPort: 8085,
        icon: ICONS.TV,
        supportedOS: OS.MAC_ONLY,
        isActive: true,
        sourceExts: {
            factors: [...EXT_TVOS_TV, ...EXT_TV],
            platforms: [...EXT_TVOS, ...EXT_IOS],
            fallbacks: [...EXT_TV_NATIVE, ...EXT_NATIVE, ...EXT_FALLBACK]
        }
    },
    macos: {
        defaultPort: 8086,
        icon: ICONS.DESKTOP,
        supportedOS: OS.MAC_ONLY,
        isActive: true,
        sourceExts: {
            factors: [...EXT_MACOS_DESKTOP, ...EXT_DESKTOP],
            platforms: [...EXT_MACOS],
            fallbacks: [...EXT_DESKTOP_WEB, ...EXT_ELECTRON, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    tizen: {
        defaultPort: 8087,
        icon: ICONS.TV,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_TIZEN_TV, ...EXT_WEB_TV, ...EXT_TV],
            platforms: [...EXT_TIZEN],
            fallbacks: [...EXT_TV_WEB, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    webos: {
        defaultPort: 8088,
        icon: ICONS.TV,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_WEBOS_TV, ...EXT_WEB_TV, ...EXT_TV],
            platforms: [...EXT_WEBOS],
            fallbacks: [...EXT_TV_WEB, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    androidwear: {
        defaultPort: 8089,
        icon: ICONS.WATCH,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_ANDROIDWEAR_WATCH, ...EXT_WATCH],
            platforms: [...EXT_ANDROIDWEAR, ...EXT_ANDROID],
            fallbacks: [...EXT_WATCH_NATIVE, ...EXT_NATIVE, ...EXT_FALLBACK]
        }
    },
    tizenwatch: {
        defaultPort: 8090,
        icon: ICONS.WATCH,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_TIZENWATCH_WATCH, ...EXT_WATCH],
            platforms: [...EXT_TIZENWATCH],
            fallbacks: [...EXT_WATCH_WEB, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    tizenmobile: {
        defaultPort: 8091,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_TIZENMOBILE_MOBILE, ...EXT_MOBILE],
            platforms: [...EXT_TIZENMOBILE],
            fallbacks: [...EXT_MOBILE_WEB, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    windows: {
        defaultPort: 8092,
        icon: ICONS.DESKTOP,
        supportedOS: OS.WINDOWS_ONLY,
        isActive: true,
        sourceExts: {
            factors: [...EXT_WIN_DESKTOP, ...EXT_DESKTOP],
            platforms: [...EXT_WIN],
            fallbacks: [...EXT_DESKTOP_WEB, ...EXT_ELECTRON, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    kaios: {
        defaultPort: 8093,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_KAIOS_MOBILE, ...EXT_MOBILE],
            platforms: [...EXT_KAIOS],
            fallbacks: [...EXT_MOBILE_WEB, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    firefoxos: {
        defaultPort: 8094,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_FFOS_MOBILE, ...EXT_MOBILE],
            platforms: [...EXT_FFOS],
            fallbacks: [...EXT_MOBILE_WEB, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    firefoxtv: {
        defaultPort: 8014,
        icon: ICONS.TV,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_FFTV_TV, ...EXT_WEB_TV, ...EXT_TV],
            platforms: [...EXT_FFTV],
            fallbacks: [...EXT_TV_WEB, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    chromecast: {
        defaultPort: 8095,
        icon: ICONS.TV,
        supportedOS: OS.ALL,
        isActive: true,
        sourceExts: {
            factors: [...EXT_CAST_TV, ...EXT_WEB_TV, ...EXT_TV],
            platforms: [...EXT_CAST],
            fallbacks: [...EXT_TV_WEB, ...EXT_WEB, ...EXT_FALLBACK_WEB]
        }
    },
    // NON ACTIVE
    watchos: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    androidauto: {
        defaultPort: 8081,
        icon: ICONS.AUTO,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    alexa: {
        defaultPort: 999999,
        icon: ICONS.VOICE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    appleauto: {
        defaultPort: 8081,
        icon: ICONS.AUTO,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    astian: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    blackberry: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    chromeos: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    fireos: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    firetv: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    hbbtv: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    meego: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    netcast: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    occulus: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    orsay: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    ps4: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    roku: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    sailfish: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    tivo: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    ubuntu: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    ubuntutouch: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    unity: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    vewd: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    vieraconnect: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    vizio: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    webian: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    wii: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    wp10: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    wp8: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    xbox: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    },
    xbox360: {
        defaultPort: 999999,
        icon: ICONS.PHONE,
        supportedOS: OS.ALL,
        isActive: false,
        sourceExts: []
    }
};

export const EXTENSIONS = {
    web: [...PLATFORMS.web.sourceExts.factors,
        ...PLATFORMS.web.sourceExts.platforms, ...PLATFORMS.web.sourceExts.fallbacks],
    ios: [...PLATFORMS.ios.sourceExts.factors,
        ...PLATFORMS.ios.sourceExts.platforms, ...PLATFORMS.ios.sourceExts.fallbacks],
    android: [...PLATFORMS.android.sourceExts.factors,
        ...PLATFORMS.android.sourceExts.platforms, ...PLATFORMS.android.sourceExts.fallbacks],
    androidtv: [...PLATFORMS.androidtv.sourceExts.factors,
        ...PLATFORMS.androidtv.sourceExts.platforms, ...PLATFORMS.androidtv.sourceExts.fallbacks],
    tvos: [...PLATFORMS.tvos.sourceExts.factors,
        ...PLATFORMS.tvos.sourceExts.platforms, ...PLATFORMS.tvos.sourceExts.fallbacks],
    macos: [...PLATFORMS.macos.sourceExts.factors,
        ...PLATFORMS.macos.sourceExts.platforms, ...PLATFORMS.macos.sourceExts.fallbacks],
    tizen: [...PLATFORMS.tizen.sourceExts.factors,
        ...PLATFORMS.tizen.sourceExts.platforms, ...PLATFORMS.tizen.sourceExts.fallbacks],
    webos: [...PLATFORMS.webos.sourceExts.factors,
        ...PLATFORMS.webos.sourceExts.platforms, ...PLATFORMS.webos.sourceExts.fallbacks],
    androidwear: [...PLATFORMS.androidwear.sourceExts.factors,
        ...PLATFORMS.androidwear.sourceExts.platforms, ...PLATFORMS.androidwear.sourceExts.fallbacks],
    tizenwatch: [...PLATFORMS.tizenwatch.sourceExts.factors,
        ...PLATFORMS.tizenwatch.sourceExts.platforms, ...PLATFORMS.tizenwatch.sourceExts.fallbacks],
    tizenmobile: [...PLATFORMS.tizenmobile.sourceExts.factors,
        ...PLATFORMS.tizenmobile.sourceExts.platforms,
        ...PLATFORMS.tizenmobile.sourceExts.fallbacks],
    windows: [...PLATFORMS.windows.sourceExts.factors,
        ...PLATFORMS.windows.sourceExts.platforms, ...PLATFORMS.windows.sourceExts.fallbacks],
    kaios: [...PLATFORMS.kaios.sourceExts.factors,
        ...PLATFORMS.kaios.sourceExts.platforms,
        ...PLATFORMS.kaios.sourceExts.fallbacks],
    firefoxos: [...PLATFORMS.firefoxos.sourceExts.factors,
        ...PLATFORMS.firefoxos.sourceExts.platforms, ...PLATFORMS.firefoxos.sourceExts.fallbacks],
    firefoxtv: [...PLATFORMS.firefoxtv.sourceExts.factors,
        ...PLATFORMS.firefoxtv.sourceExts.platforms, ...PLATFORMS.firefoxtv.sourceExts.fallbacks],
    chromecast: [...PLATFORMS.chromecast.sourceExts.factors,
        ...PLATFORMS.chromecast.sourceExts.platforms, ...PLATFORMS.chromecast.sourceExts.fallbacks]
};

export const WEB_HOSTED_PLATFORMS = [
    WEB,
    TIZEN,
    WEBOS,
    MACOS,
    WINDOWS,
    TIZEN_MOBILE,
    TIZEN_WATCH
];
// PLATFORM GROUP
export const PLATFORM_GROUP_SMARTTV = 'smarttv';
export const PLATFORM_GROUP_ELECTRON = 'electron';
// FORM FACTOR
export const FORM_FACTOR_MOBILE = 'mobile';
export const FORM_FACTOR_DESKTOP = 'desktop';
export const FORM_FACTOR_WATCH = 'watch';
export const FORM_FACTOR_TV = 'tv';
// CLI
export const CLI_ANDROID_EMULATOR = 'androidEmulator';
export const CLI_ANDROID_ADB = 'androidAdb';
export const CLI_ANDROID_AVDMANAGER = 'androidAvdManager';
export const CLI_ANDROID_SDKMANAGER = 'androidSdkManager';
export const CLI_TIZEN_EMULATOR = 'tizenEmulator';
export const CLI_KAIOS_EMULATOR = 'tizenEmulator';
export const CLI_TIZEN = 'tizen';
export const CLI_SDB_TIZEN = 'tizenSdb';
export const CLI_WEBOS_ARES = 'webosAres';
export const CLI_WEBOS_ARES_PACKAGE = 'webosAresPackage';
export const CLI_WEBOS_ARES_INSTALL = 'webosAresInstall';
export const CLI_WEBOS_ARES_LAUNCH = 'webosAresLaunch';
export const CLI_WEBOS_ARES_SETUP_DEVICE = 'webosAresSetup';
export const CLI_WEBOS_ARES_DEVICE_INFO = 'webosAresDeviceInfo';
export const CLI_WEBOS_ARES_NOVACOM = 'webosAresNovacom';
// SDK
export const ANDROID_SDK = 'ANDROID_SDK';
export const ANDROID_NDK = 'ANDROID_NDK';
export const TIZEN_SDK = 'TIZEN_SDK';
export const WEBOS_SDK = 'WEBOS_SDK';
export const KAIOS_SDK = 'KAIOS_SDK';

export const RENATIVE_CONFIG_NAME = 'renative.json';
export const RENATIVE_CONFIG_LOCAL_NAME = 'renative.local.json';
export const RENATIVE_CONFIG_PRIVATE_NAME = 'renative.private.json';
export const RENATIVE_CONFIG_TEMPLATE_NAME = 'renative.template.json';
export const RENATIVE_CONFIG_BUILD_NAME = 'renative.build.json';
export const RENATIVE_CONFIG_RUNTIME_NAME = 'renative.runtime.json';
export const RENATIVE_CONFIG_WORKSPACES_NAME = 'renative.workspaces.json';
export const RENATIVE_CONFIG_PLUGINS_NAME = 'renative.plugins.json';
export const RENATIVE_CONFIG_TEMPLATES_NAME = 'renative.templates.json';
export const RENATIVE_CONFIG_PLATFORMS_NAME = 'renative.platforms.json';
export const RENATIVE_CONFIG_ENGINES_NAME = 'renative.engines.json';
export const RN_CLI_CONFIG_NAME = 'metro.config.js';
export const RN_BABEL_CONFIG_NAME = 'babel.config.js';
export const NEXT_CONFIG_NAME = 'next.config.js';
export const SAMPLE_APP_ID = 'helloworld';

export const IS_TABLET_ABOVE_INCH = 6.5;
export const IS_WEAR_UNDER_SIZE = 1000; // width + height

export const PACKAGE_JSON_FILEDS = [
    'name',
    'version',
    'description',
    'keywords',
    'homepage',
    'bugs',
    'license',
    'author',
    'contributors',
    'files',
    'main',
    'browser',
    'bin',
    'man',
    'directories',
    'repository',
    'scripts',
    'config',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'bundledDependencies',
    'optionalDependencies',
    'engines',
    'engineStrict',
    'os',
    'cpu',
    'private',
    'publishConfig'
];
export const SUPPORTED_PLATFORMS = [
    IOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN,
    TIZEN_MOBILE,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    CHROMECAST
];
export const SUPPORTED_PLATFORMS_MAC = [
    IOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN_MOBILE,
    TIZEN,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV
];
export const SUPPORTED_PLATFORMS_WIN = [
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    TIZEN,
    TVOS,
    TIZEN_MOBILE,
    WEBOS,
    WINDOWS,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV
];
export const SUPPORTED_PLATFORMS_LINUX = [ANDROID, ANDROID_TV, ANDROID_WEAR];
export const SDK_PLATFORMS = {};
SDK_PLATFORMS[ANDROID] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_TV] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_WEAR] = ANDROID_SDK;
SDK_PLATFORMS[TIZEN] = TIZEN_SDK;
SDK_PLATFORMS[TIZEN_WATCH] = TIZEN_SDK;
SDK_PLATFORMS[TIZEN_MOBILE] = TIZEN_SDK;
SDK_PLATFORMS[WEBOS] = WEBOS_SDK;
SDK_PLATFORMS[KAIOS] = KAIOS_SDK;

export const TASK_RUN = 'run';
export const TASK_CONFIGURE = 'configure';
export const TASK_DOCTOR = 'doctor';
export const TASK_BUILD = 'build';
export const TASK_INFO = 'info';
export const TASK_START = 'start';
export const TASK_EXPORT = 'export';
export const TASK_DEBUG = 'debug';
export const TASK_PACKAGE = 'package';
export const TASK_DEPLOY = 'deploy';
export const TASK_LOG = 'log';
export const TASK_CLEAN = 'clean';
export const TASK_INSTALL = 'install';
export const TASK_PUBLISH = 'publish';
export const TASK_STATUS = 'status';
export const TASK_SWITCH = 'switch';
export const TASK_TARGET_LAUNCH = 'target launch';
export const TASK_TARGET_LIST = 'target list';
export const TASK_TARGET = 'target';
export const TASK_TEMPLATE_ADD = 'template add';
export const TASK_TEMPLATE_LIST = 'template list';
export const TASK_TEMPLATE_APPLY = 'template apply';
export const TASK_WORKSPACE_ADD = 'workspace add';
export const TASK_WORKSPACE_CONNECT = 'workspace connect';
export const TASK_WORKSPACE_LIST = 'workspace list';
export const TASK_WORKSPACE_UPDATE = 'workspace update';
export const TASK_PLATFORM_CONFIGURE = 'platform configure';
export const TASK_PLATFORM_CONNECT = 'platform connect';
export const TASK_PLATFORM_EJECT = 'platform eject';
export const TASK_PLATFORM_LIST = 'platform list';
export const TASK_PLATFORM_SETUP = 'platform setup';
export const TASK_PROJECT_CONFIGURE = 'project configure';
export const TASK_PROJECT_UPGRADE = 'project upgrade';
export const TASK_PLUGIN_ADD = 'plugin add';
export const TASK_PLUGIN_LIST = 'plugin list';
export const TASK_PLUGIN_UPDATE = 'plugin update';
export const TASK_CRYPTO_ENCRYPT = 'crypto encrypt';
export const TASK_CRYPTO_DECRYPT = 'crypto decrypt';
export const TASK_CRYPTO_INSTALL_CERTS = 'crypto installCerts';
export const TASK_CRYPTO_INSTALL_PROFILES = 'crypto installProfiles';
export const TASK_CRYPTO_INSTALL_PROFILE = 'crypto installProfile';
export const TASK_CRYPTO_UPDATE_PROFILE = 'crypto updateProfile';
export const TASK_CRYPTO_UPDATE_PROFILES = 'crypto updateProfiles';
export const TASK_HOOKS_RUN = 'hooks run';
export const TASK_HOOKS_LIST = 'hooks list';
export const TASK_HOOKS_PIPES = 'hooks pipes';
export const TASK_PKG = 'pkg';
export const TASK_APP_CONFIGURE = 'app configure';
export const TASK_APP_CREATE = 'app create';
export const TASK_WORKSPACE_CONFIGURE = 'workspace configure';
export const TASK_CONFIGURE_SOFT = 'configureSoft';
export const TASK_KILL = 'kill';

const _PARAMS = {
    info: {
        shortcut: 'i',
        value: 'value',
        description: 'Show full debug Info'
    },
    updatePods: {
        shortcut: 'u',
        description: 'Force update dependencies (iOS only)'
    },
    platform: {
        shortcut: 'p',
        value: 'value',
        description: 'select specific Platform'
    },
    appConfigID: {
        shortcut: 'c',
        value: 'value',
        description: 'select specific app Config id'
    },
    target: {
        shortcut: 't',
        value: 'value',
        description: 'select specific Target device/simulator'
    },
    template: {
        shortcut: 'T',
        value: 'value',
        isRequired: true,
        description: 'select specific template'
    },
    device: {
        shortcut: 'd',
        value: 'value',
        description: 'select connected Device'
    },
    scheme: {
        shortcut: 's',
        value: 'value',
        description: 'select build Scheme'
    },
    filter: {
        shortcut: 'f',
        value: 'value',
        isRequired: true,
        description: 'Filter value'
    },
    list: {
        shortcut: 'l',
        description: 'return List of items related to command'
    },
    only: {
        shortcut: 'o',
        description: 'run Only top command (Skip dependencies)'
    },
    reset: {
        shortcut: 'r',
        description: 'also perform Reset of platform'
    },
    resetHard: {
        shortcut: 'R',
        description: 'also perform Reset of platform and all assets'
    },
    key: {
        shortcut: 'k',
        value: 'value',
        isRequired: true,
        description: 'Pass the key/password'
    },
    blueprint: {
        shortcut: 'b',
        value: 'value',
        description: 'Blueprint for targets'
    },
    help: {
        shortcut: 'h',
        description: 'Displays help info for particular command'
    },
    host: {
        shortcut: 'H',
        value: 'value',
        isRequired: true,
        description: 'custom Host ip'
    },
    exeMethod: {
        shortcut: 'x',
        value: 'value',
        isRequired: true,
        description: 'eXecutable method in buildHooks'
    },
    port: {
        shortcut: 'P',
        value: 'value',
        isRequired: true,
        description: 'custom Port'
    },
    debug: {
        shortcut: 'D',
        value: 'value',
        description: 'enable or disable remote debugger.',
        examples: [
            '--debug weinre //run remote debug with weinre as preference',
            '--debug chii //run remote debug with chii as preference',
            '--debug false //force disable remote debug',
            '--debug //run remote debug with default preference (chii)'
        ]
    },
    global: {
        shortcut: 'G',
        description: 'Flag for setting a config value for all RNV projects'
    },
    engine: {
        shortcut: 'e',
        value: 'value',
        isRequired: true,
        description: 'engine to be used (next)'
    },
    debugIp: {
        value: 'value',
        isRequired: true,
        description: '(optional) overwrite the ip to which the remote debugger will connect'
    },
    ci: {
        description: 'CI/CD flag so it wont ask questions'
    },
    mono: {
        description: 'Monochrome console output without chalk'
    },
    skipNotifications: {
        description: 'Skip sending any integrated notifications'
    },
    keychain: {
        value: 'value',
        isRequired: true,
        description: 'Name of the keychain'
    },
    provisioningStyle: {
        value: 'value',
        isRequired: true,
        description: 'Set provisioningStyle <Automatic | Manual>'
    },
    codeSignIdentity: {
        value: 'value',
        isRequired: true,
        description: 'Set codeSignIdentity ie <iPhone Distribution>'
    },
    provisionProfileSpecifier: {
        value: 'value',
        isRequired: true,
        description: 'Name of provisionProfile'
    },
    hosted: {
        description: 'Run in a hosted environment (skip budleAssets)'
    },
    maxErrorLength: {
        value: 'number',
        isRequired: true,
        description: 'Specify how many characters each error should display. Default 200'
    },
    skipTargetCheck: {
        description: 'Skip Android target check, just display the raw adb devices to choose from'
    },
    analyzer: {
        description: 'Enable real-time bundle analyzer'
    },
    xcodebuildArchiveArgs: {
        value: 'value',
        isRequired: true,
        description: 'pass down custom xcodebuild arguments'
    },
    xcodebuildExportArgs: {
        value: 'value',
        isRequired: true,
        description: 'pass down custom xcodebuild arguments'
    }
};

Object.keys(_PARAMS).forEach((k) => {
    _PARAMS[k].key = k;
});


export const PARAMS = {
    withBase: arr => [_PARAMS.info, _PARAMS.ci, _PARAMS.mono, _PARAMS.maxErrorLength, _PARAMS.only].concat(arr || []),
    withConfigure: arr => [_PARAMS.reset, _PARAMS.resetHard, _PARAMS.engine,
        _PARAMS.appConfigID, _PARAMS.scheme, _PARAMS.platform].concat(arr || []),
    withRun: arr => [_PARAMS.target, _PARAMS.device, _PARAMS.hosted,
        _PARAMS.port, _PARAMS.debug, _PARAMS.debugIp, _PARAMS.skipTargetCheck, _PARAMS.host].concat(arr || []),
    withAll: arr => Object.values(_PARAMS).concat(arr || []),
    all: Object.keys(_PARAMS)
};


export const configSchema = {
    analytics: {
        values: ['true', 'false'],
        key: 'enableAnalytics',
        default: true
    }
};


export const INJECTABLE_CONFIG_PROPS = ['id', 'title', 'entryFile', 'backgroundColor', 'scheme',
    'teamID', 'provisioningStyle', 'bundleAssets', 'enableHermes', 'universalApk', 'multipleAPKs', 'pagesDir'];
export const INJECTABLE_RUNTIME_PROPS = ['appId', 'scheme', 'timestamp', 'localhost', 'target', 'port'];

export const REDASH_URL = 'https://rnv.nxg.staging.24imedia.com/events';
export const REDASH_KEY = 'zCYINQqMxvat1V41Hb9d69JMVBDNLyeQ4wICtdtD';

export const REMOTE_DEBUGGER_ENABLED_PLATFORMS = [TIZEN, TIZEN_MOBILE, TIZEN_WATCH];
