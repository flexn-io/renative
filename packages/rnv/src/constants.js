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
    android: { defaultPort: 8081, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true },
    androidtv: { defaultPort: 8081, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true },
    androidwear: { defaultPort: 8081, icon: ICONS.WATCH, supportedOS: OS.ALL, isActive: true },
    firefoxos: { defaultPort: 8089, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true },
    firefoxtv: { defaultPort: 8088, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true },
    ios: { defaultPort: 8081, icon: ICONS.PHONE, supportedOS: OS.MAC_ONLY, isActive: true },
    kaios: { defaultPort: 8086, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: true },
    macos: { defaultPort: 8084, icon: ICONS.DESKTOP, supportedOS: OS.MAC_ONLY, isActive: true },
    tizen: { defaultPort: 8083, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true },
    tizenwatch: { defaultPort: 8087, icon: ICONS.WATCH, supportedOS: OS.ALL, isActive: true },
    tvos: { defaultPort: 8081, icon: ICONS.TV, supportedOS: OS.MAC_ONLY, isActive: true },
    web: { defaultPort: 8080, icon: ICONS.BROWSER, supportedOS: OS.ALL, isActive: true },
    webos: { defaultPort: 8083, icon: ICONS.TV, supportedOS: OS.ALL, isActive: true },
    windows: { defaultPort: 8085, icon: ICONS.DESKTOP, supportedOS: OS.WINDOWS_ONLY, isActive: true },
    // NON ACTIVE
    watchos: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    androidauto: { defaultPort: 8081, icon: ICONS.AUTO, supportedOS: OS.ALL, isActive: false },
    alexa: { defaultPort: 999999, icon: ICONS.VOICE, supportedOS: OS.ALL, isActive: false },
    appleauto: { defaultPort: 8081, icon: ICONS.AUTO, supportedOS: OS.ALL, isActive: false },
    astian: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    blackberry: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    chromecast: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    chromeos: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    fireos: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    firetv: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    hbbtv: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    meego: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    netcast: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    occulus: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    orsay: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    ps4: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    roku: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    sailfish: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    tivo: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    ubuntu: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    ubuntutouch: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    unity: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    vewd: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    vieraconnect: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    vizio: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    webnext: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    webian: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    wii: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    wp10: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    wp8: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    xbox: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
    xbox360: { defaultPort: 999999, icon: ICONS.PHONE, supportedOS: OS.ALL, isActive: false },
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
const CLI_WEBBOS_ARES_INSTALL = 'webosAresInstall';
const CLI_WEBBOS_ARES_LAUNCH = 'webosAresLaunch';
const CLI_WEBOS_ARES_SETUP_DEVICE = 'webosAresSetup';
const CLI_WEBOS_ARES_DEVICE_INFO = 'webosAresDeviceInfo';

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
    CLI_WEBBOS_ARES_INSTALL,
    CLI_WEBBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_SETUP_DEVICE,
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
    SAMPLE_APP_ID,
    RN_BABEL_CONFIG_NAME,
    RNV_PROJECT_CONFIG_LOCAL_NAME,
    IS_TABLET_ABOVE_INCH,
    IS_WEAR_UNDER_SIZE
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
    CLI_WEBBOS_ARES_INSTALL,
    CLI_WEBBOS_ARES_LAUNCH,
    CLI_WEBOS_ARES_SETUP_DEVICE,
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
    RNV_PROJECT_CONFIG_LOCAL_NAME
};
