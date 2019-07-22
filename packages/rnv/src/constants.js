// PLATFORM
const ANDROID = 'android';
const ANDROID_AUTO = 'androidauto';
const ANDROID_TV = 'androidtv';
const ANDROID_WEAR = 'androidwear';
const ALEXA = 'alexa';
const APPLE_AUTO = 'appleauto';
const ASTIAN = 'astian';
const BLACKBERRY = 'blackberry';
const CHROMECAST = 'chromecast';
const CHROME_OS = 'chromeos';
const FIREFOX_OS = 'firefoxos';
const FIREFOX_TV = 'firefoxtv';
const FIRE_OS = 'fireos';
const FIRE_TV = 'firetv';
const HBBTV = 'hbbtv';
const IOS = 'ios';
const KAIOS = 'kaios';
const MACOS = 'macos';
const MEEGO = 'meego';
const NETCAST = 'netcast';
const OCCULUS = 'occulus';
const ORSAY = 'orsay';
const PS4 = 'ps4';
const ROKU = 'roku';
const SAILFISH = 'sailfish';
const TIVO = 'tivo';
const TIZEN = 'tizen';
const TIZEN_WATCH = 'tizenwatch';
const TIZEN_MOBILE = 'tizenmobile';
const TVOS = 'tvos';
const UBUNTU = 'ubuntu';
const UBUNTU_TOUCH = 'ubuntutouch';
const UNITY = 'unity';
const VEWD = 'vewd';
const VIERACONNECT = 'vieraconnect';
const VIZIO = 'vizio';
const WATCHOS = 'watchos';
const WEB = 'web';
const WEBNEXT = 'webnext';
const WEBOS = 'webos';
const WEBIAN = 'webian';
const WII = 'wii';
const WINDOWS = 'windows';
const WP10 = 'wp10';
const WP8 = 'wp8';
const XBOX = 'xbox';
const XBOX360 = 'xbox360';
// Kodi, Boxee, HorizonTV, Mediaroom(Ericsson), YahooSmartTV, Slingbox, Hololens, Occulus, GearVR, WebVR

const ICONS = {
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

const OS_WINDOWS = 'windows';
const OS_MAC = 'mac';
const OS_LINUX = 'linux';

const OS = {
    ALL: [OS_MAC, OS_WINDOWS, OS_LINUX],
    MAC_ONLY: [OS_MAC],
    WINDOWS_ONLY: [OS_WINDOWS],
    LINUX_ONLY: [OS_LINUX]
};

const PLATFORMS = {
    // ACTIVE
    android: { defaultPort: 8081, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true, useSharedConfig: false },
    androidtv: { defaultPort: 8081, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true, useSharedConfig: false },
    androidwear: { defaultPort: 8081, icon: ICONS.WATCH, supportedOS: OS.ALL, isActive: true, useSharedConfig: false },
    firefoxos: { defaultPort: 8089, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true, useSharedConfig: true },
    firefoxtv: { defaultPort: 8088, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true, useSharedConfig: true },
    ios: { defaultPort: 8081, icon: ICONS.PHONE, supportedOS: OS.MAC_ONLY, isActive: true, useSharedConfig: false },
    kaios: { defaultPort: 8086, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true, useSharedConfig: true },
    macos: { defaultPort: 8084, icon: ICONS.DESKTOP, supportedOS: OS.MAC_ONLY, isActive: true, useSharedConfig: true },
    tizen: { defaultPort: 8083, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true, useSharedConfig: true },
    tizenwatch: { defaultPort: 8087, icon: ICONS.WATCH, supportedOS: OS.ALL, isActive: true, useSharedConfig: true },
    tvos: { defaultPort: 8081, icon: ICONS.TV, supportedOS: OS.MAC_ONLY, isActive: true, useSharedConfig: false },
    web: { defaultPort: 8080, icon: ICONS.BROWSER, supportedOS: OS.ALL, isActive: true, useSharedConfig: true },
    webos: { defaultPort: 8083, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true, useSharedConfig: true },
    windows: { defaultPort: 8085, icon: ICONS.DESKTOP, supportedOS: OS.WINDOWS_ONLY, isActive: true, useSharedConfig: true },
    // NON ACTIVE
    watchos: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    androidauto: { defaultPort: 8081, icon: ICONS.AUTO, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    alexa: { defaultPort: 999999, icon: ICONS.VOICE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    appleauto: { defaultPort: 8081, icon: ICONS.AUTO, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    astian: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    blackberry: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    chromecast: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    chromeos: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    fireos: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    firetv: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    hbbtv: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    meego: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    netcast: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    occulus: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    orsay: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    ps4: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    roku: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    sailfish: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    tivo: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    ubuntu: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    ubuntutouch: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    unity: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    vewd: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    vieraconnect: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    vizio: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    webnext: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    webian: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    wii: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    wp10: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    wp8: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    xbox: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
    xbox360: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false, useSharedConfig: true },
};


// PLATFORM GROUP
const PLATFORM_GROUP_SMARTTV = 'smarttv';
const PLATFORM_GROUP_ELECTRON = 'electron';

// FORM FACTOR
const FORM_FACTOR_MOBILE = 'mobile';
const FORM_FACTOR_DESKTOP = 'desktop';
const FORM_FACTOR_WATCH = 'watch';
const FORM_FACTOR_TV = 'tv';

// CLI
const CLI_ANDROID_EMULATOR = 'androidEmulator';
const CLI_ANDROID_ADB = 'androidAdb';
const CLI_ANDROID_AVDMANAGER = 'androidAvdManager';
const CLI_ANDROID_SDKMANAGER = 'androidSdkManager';
const CLI_TIZEN_EMULATOR = 'tizenEmulator';
const CLI_KAIOS_EMULATOR = 'tizenEmulator';
const CLI_TIZEN = 'tizen';
const CLI_SDB_TIZEN = 'tizenSdb';
const CLI_WEBOS_ARES = 'webosAres';
const CLI_WEBOS_ARES_PACKAGE = 'webosAresPackage';
const CLI_WEBOS_ARES_INSTALL = 'webosAresInstall';
const CLI_WEBOS_ARES_LAUNCH = 'webosAresLaunch';
const CLI_WEBOS_ARES_SETUP_DEVICE = 'webosAresSetup';
const CLI_WEBOS_ARES_DEVICE_INFO = 'webosAresDeviceInfo';
const CLI_WEBOS_ARES_NOVACOM = 'webosAresNovacom';

const ANDROID_SDK = 'ANDROID_SDK';
const ANDROID_NDK = 'ANDROID_NDK';
const TIZEN_SDK = 'TIZEN_SDK';
const WEBOS_SDK = 'WEBOS_SDK';
const KAIOS_SDK = 'KAIOS_SDK';

const RNV_PROJECT_CONFIG_NAME = 'rnv-config.json';
const RNV_PROJECT_CONFIG_LOCAL_NAME = 'rnv-config.local.json';
const RNV_GLOBAL_CONFIG_NAME = 'config.json';
const RNV_APP_CONFIG_NAME = 'config.json';
const RN_CLI_CONFIG_NAME = 'rn-cli.config.js';
const RN_BABEL_CONFIG_NAME = 'babel.config.js';
const SAMPLE_APP_ID = 'helloWorld';

const IS_TABLET_ABOVE_INCH = 6.5;
const IS_WEAR_UNDER_SIZE = 1000; // width + height

const PACKAGE_JSON_FILEDS = [
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
// custom: "title","codename","jest",

export {
    PLATFORMS,
    ANDROID,
    ANDROID_AUTO,
    ANDROID_TV,
    ANDROID_WEAR,
    ASTIAN,
    ALEXA,
    APPLE_AUTO,
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
    CLI_WEBOS_ARES_DEVICE_INFO,
    CLI_WEBOS_ARES_NOVACOM,
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
    RNV_PROJECT_CONFIG_NAME,
    RNV_GLOBAL_CONFIG_NAME,
    RNV_APP_CONFIG_NAME,
    RN_CLI_CONFIG_NAME,
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    RNV_PROJECT_CONFIG_LOCAL_NAME,
    IS_TABLET_ABOVE_INCH,
    IS_WEAR_UNDER_SIZE,
    PACKAGE_JSON_FILEDS
};

export default {
    PLATFORMS,
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
    RNV_PROJECT_CONFIG_NAME,
    RNV_GLOBAL_CONFIG_NAME,
    RNV_APP_CONFIG_NAME,
    RN_CLI_CONFIG_NAME,
    RN_BABEL_CONFIG_NAME,
    SAMPLE_APP_ID,
    RNV_PROJECT_CONFIG_LOCAL_NAME,
    PACKAGE_JSON_FILEDS
};
