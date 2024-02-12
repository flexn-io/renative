// PLATFORM
import { homedir } from 'os';
import { ConfigPropKey } from './schema/types';

export const USER_HOME_DIR = homedir();

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
export const WEBTV = 'webtv';
export const WEBOS = 'webos';
export const WEBIAN = 'webian';
export const WII = 'wii';
export const WINDOWS = 'windows';
export const LINUX = 'linux';
export const WP10 = 'wp10';
export const WP8 = 'wp8';
export const XBOX = 'xbox';
export const XBOX360 = 'xbox360';
// Kodi, Boxee, HorizonTV, Mediaroom(Ericsson), YahooSmartTV, Slingbox, Hololens, Occulus, GearVR, WebVR, Saphi

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
export const RENATIVE_CONFIG_ENGINE_NAME = 'renative.engine.json';
export const SAMPLE_APP_ID = 'helloworld';

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
    'publishConfig',
];
// DEPRECATED
export const SUPPORTED_PLATFORMS = [
    IOS,
    ANDROID,
    FIRE_TV,
    ANDROID_TV,
    ANDROID_WEAR,
    WEB,
    WEBTV,
    TIZEN,
    TIZEN_MOBILE,
    TVOS,
    WEBOS,
    MACOS,
    WINDOWS,
    LINUX,
    TIZEN_WATCH,
    KAIOS,
    CHROMECAST,
    XBOX,
] as const;

export const TASK_RUN = 'run';
export const TASK_CONFIGURE = 'configure';
export const TASK_DOCTOR = 'doctor';
export const TASK_NEW = 'new';
export const TASK_HELP = 'help';
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
export const TASK_EJECT = 'eject';

export const INJECTABLE_CONFIG_PROPS: Array<ConfigPropKey> = [
    'id',
    'title',
    'entryFile',
    'backgroundColor',
    'scheme',
    'teamID',
    'provisioningStyle',
    'bundleAssets',
    'multipleAPKs',
    'pagesDir',
];
export const INJECTABLE_RUNTIME_PROPS = ['appId', 'scheme', 'timestamp', 'localhost', 'target', 'port'] as const;

export const REMOTE_DEBUGGER_ENABLED_PLATFORMS = [TIZEN, TIZEN_MOBILE, TIZEN_WATCH];

export const DEFAULT_TASK_DESCRIPTIONS: Record<string, string> = {
    [TASK_RUN]: 'Run your app on target device or emulator',
    [TASK_PACKAGE]: 'Package source files into bundle',
    [TASK_BUILD]: 'Build project binary',
    [TASK_CONFIGURE]: 'Configure current project',
    [TASK_START]: 'Starts bundler / server',
    [TASK_EXPORT]: 'Export the app into deployable binary',
};

export const COMMON_TASKS = [
    TASK_RUN,
    TASK_BUILD,
    TASK_CONFIGURE,
    TASK_NEW,
    TASK_HELP,
    TASK_PACKAGE,
    TASK_START,
    TASK_EXPORT,
];
