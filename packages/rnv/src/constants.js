// PLATFORM
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
export const WEBNEXT = 'webnext';
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

export const PLATFORMS = {
    // ACTIVE
    android: { defaultPort: 8081, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: false },
    androidtv: { defaultPort: 8081, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: false },
    androidwear: { defaultPort: 8081, icon: ICONS.WATCH, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: false },
    firefoxos: { defaultPort: 8089, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: true },
    firefoxtv: { defaultPort: 8088, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: true },
    ios: { defaultPort: 8081, icon: ICONS.PHONE, supportedOS: OS.MAC_ONLY, isActive: true, requiresSharedConfig: false },
    kaios: { defaultPort: 8086, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: true },
    macos: { defaultPort: 8084, icon: ICONS.DESKTOP, supportedOS: OS.MAC_ONLY, isActive: true, requiresSharedConfig: true },
    tizen: { defaultPort: 8083, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: true },
    tizenwatch: { defaultPort: 8087, icon: ICONS.WATCH, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: true },
    tizenmobile: { defaultPort: 8087, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: true },
    tvos: { defaultPort: 8081, icon: ICONS.TV, supportedOS: OS.MAC_ONLY, isActive: true, requiresSharedConfig: false },
    web: { defaultPort: 8080, icon: ICONS.BROWSER, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: true },
    webos: { defaultPort: 8083, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true, requiresSharedConfig: true },
    windows: { defaultPort: 8085, icon: ICONS.DESKTOP, supportedOS: OS.WINDOWS_ONLY, isActive: true, requiresSharedConfig: true },
    // NON ACTIVE
    watchos: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    androidauto: { defaultPort: 8081, icon: ICONS.AUTO, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    alexa: { defaultPort: 999999, icon: ICONS.VOICE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    appleauto: { defaultPort: 8081, icon: ICONS.AUTO, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    astian: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    blackberry: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    chromecast: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    chromeos: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    fireos: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    firetv: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    hbbtv: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    meego: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    netcast: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    occulus: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    orsay: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    ps4: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    roku: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    sailfish: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    tivo: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    ubuntu: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    ubuntutouch: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    unity: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    vewd: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    vieraconnect: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    vizio: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    webnext: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    webian: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    wii: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    wp10: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    wp8: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    xbox: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
    xbox360: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, requiresSharedConfig: true },
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
export const RN_CLI_CONFIG_NAME = 'rn-cli.config.js';
export const RN_BABEL_CONFIG_NAME = 'babel.config.js';
export const SAMPLE_APP_ID = 'helloWorld';

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
    FIREFOX_TV,
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
    FIREFOX_TV,
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

export default {
    PLATFORMS,
    WEB_HOSTED_PLATFORMS,
    ANDROID,
    ANDROID_AUTO,
    ANDROID_TV,
    ANDROID_WEAR,
    ALEXA,
    APPLE_AUTO,
    ASTIAN,
    BLACKBERRY,
    CHROMECAST,
    CHROME_OS,
    FIREFOX_OS,
    FIREFOX_TV,
    FIRE_OS,
    FIRE_TV,
    HBBTV,
    IOS,
    KAIOS,
    MACOS,
    MEEGO,
    NETCAST,
    OCCULUS,
    ORSAY,
    PS4,
    ROKU,
    SAILFISH,
    TIVO,
    TIZEN,
    TIZEN_WATCH,
    TIZEN_MOBILE,
    TVOS,
    UBUNTU,
    UBUNTU_TOUCH,
    UNITY,
    VEWD,
    VIERACONNECT,
    VIZIO,
    WATCHOS,
    WEB,
    WEBIAN,
    WEBNEXT,
    WEBOS,
    WII,
    WINDOWS,
    WP10,
    WP8,
    XBOX,
    XBOX360,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_SDKMANAGER,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_SDB_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_SETUP_DEVICE,
    CLI_WEBOS_ARES_NOVACOM,
    CLI_WEBOS_ARES_DEVICE_INFO,
    CLI_KAIOS_EMULATOR,
    FORM_FACTOR_MOBILE,
    FORM_FACTOR_DESKTOP,
    FORM_FACTOR_WATCH,
    FORM_FACTOR_TV,
    ANDROID_SDK,
    ANDROID_NDK,
    TIZEN_SDK,
    WEBOS_SDK,
    KAIOS_SDK,
    RENATIVE_CONFIG_NAME,
    RENATIVE_CONFIG_PRIVATE_NAME,
    RENATIVE_CONFIG_LOCAL_NAME,
    RN_CLI_CONFIG_NAME,
    RN_BABEL_CONFIG_NAME,
    SAMPLE_APP_ID,
    PACKAGE_JSON_FILEDS,
    SUPPORTED_PLATFORMS_MAC,
    SUPPORTED_PLATFORMS_WIN,
    SUPPORTED_PLATFORMS_LINUX,
    SUPPORTED_PLATFORMS,
    SDK_PLATFORMS
};
