import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { cleanFolder } from './fileutils';


const ANDROID = 'android';
const ANDROID_AUTO = 'androidauto';
const ANDROID_TV = 'androidtv';
const ANDROID_WEAR = 'androidwear';
const ALEXA = 'alexa';
const APPLE_AUTO = 'appleauto';
const BLACKBERRY = 'blackberry';
const CHROMECAST = 'chromecast';
const CHROME_OS = 'chromeos';
const FIREFOX_OS = 'firefoxos';
const FIRE_OS = 'fireos';
const FIRE_TV = 'firetv';
const HBBTV = 'hbbtv';
const IOS = 'ios';
const KAIOS = 'kaios';
const MACOS = 'macos';
const NETCAST = 'netcast';
const OCCULUS = 'occulus';
const ORSAY = 'orsay';
const PS4 = 'ps4';
const ROKU = 'roku';
const TIVO = 'tivo';
const TIZEN = 'tizen';
const TIZEN_WATCH = 'tizenwatch';
const TVOS = 'tvos';
const UBUNTU = 'ubuntu';
const UNITY = 'unity';
const VEWD = 'vewd';
const VIZIO = 'vizio';
const WATCHOS = 'watchos';
const WEB = 'web';
const WEBNEXT = 'webnext';
const WEBOS = 'webos';
const WII = 'wii';
const WINDOWS = 'windows';
const WP10 = 'wp10';
const WP8 = 'wp8';
const XBOX = 'xbox';
const XBOX360 = 'xbox360';

const CLI_ANDROID_EMULATOR = 'androidEmulator';
const CLI_ANDROID_ADB = 'androidAdb';
const CLI_TIZEN_EMULATOR = 'tizenEmulator';
const CLI_TIZEN = 'tizen';
const CLI_WEBOS_ARES = 'webosAres';
const CLI_WEBOS_ARES_PACKAGE = 'webosAresPackage';
const CLI_WEBBOS_ARES_INSTALL = 'webosAresInstall';
const CLI_WEBBOS_ARES_LAUNCH = 'webosAresLaunch';

const ANDROID_SDK = 'ANDROID_SDK';
const ANDROID_NDK = 'ANDROID_NDK';
const TIZEN_SDK = 'TIZEN_SDK';
const WEBOS_SDK = 'WEBOS_SDK';

const SUPPORTED_PLATFORMS = [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TVOS, WEBOS, MACOS, WINDOWS];
const SUPPORTED_PLATFORMS_MAC = [IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TVOS, WEBOS, MACOS, WINDOWS];
const SUPPORTED_PLATFORMS_WIN = [ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TVOS, WEBOS, WINDOWS];
const SUPPORTED_PLATFORMS_LINUX = [];
const RNV_START = '🚀 RNV';
const RNV = 'RNV';
const LINE = chalk.white.bold('----------------------------------------------------------');

let _currentJob;
let _currentProcess;
let _isInfoEnabled = false;
let _appConfigId;

const base = path.resolve('.');
const homedir = require('os').homedir();

const SDK_PLATFORMS = {};
SDK_PLATFORMS[ANDROID] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_TV] = ANDROID_SDK;
SDK_PLATFORMS[ANDROID_WEAR] = ANDROID_SDK;
SDK_PLATFORMS[TIZEN] = TIZEN_SDK;
SDK_PLATFORMS[WEBOS] = WEBOS_SDK;


const isPlatformSupported = (platform, resolve, reject) => {
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
        console.log(chalk.red(`Warning: Platform ${platform} is not supported`));
        if (reject) reject();
        return false;
    }
    if (resolve) resolve();
    return true;
};

const initializeBuilder = (cmd, subCmd, process, program) => new Promise((resolve, reject) => {
    _currentJob = cmd;
    _currentProcess = process;
    _isInfoEnabled = program.info === true;
    _appConfigId = program.appConfigID;
    let c = { cli: {} };

    const platformAssetsFolder = path.join(base, 'platformAssets');
    const platformBuildsFolder = path.join(base, 'platformBuilds');
    const platformTemplatesFolder = path.join(__dirname, '../platformTemplates');
    const projectRootFolder = base;
    const rnvFolder = path.join(__dirname, '..');
    let globalConfigFolder;


    const rootConfig = JSON.parse(fs.readFileSync(path.join(base, 'config.json')).toString());
    if (rootConfig.globalConfigFolder.startsWith('~')) {
        globalConfigFolder = path.join(homedir, rootConfig.globalConfigFolder.substr(1));
    } else {
        globalConfigFolder = path.join(base, rootConfig.globalConfigFolder);
    }

    c.program = program;
    c.process = process;
    c.globalConfigFolder = globalConfigFolder;
    c.platform = program.platform;
    c.command = cmd;
    c.projectRootFolder = projectRootFolder;
    c.rnvFolder = rnvFolder;
    c.homeFolder = homedir;
    c.globalConfigPath = path.join(c.globalConfigFolder, 'config.json');
    c.subCommand = subCmd;

    if (fs.existsSync(c.globalConfigPath)) {
        c.globalConfig = JSON.parse(fs.readFileSync(c.globalConfigPath).toString());

        c.cli[CLI_ANDROID_EMULATOR] = path.join(c.globalConfig.sdks.ANDROID_SDK, 'tools/emulator');
        c.cli[CLI_ANDROID_ADB] = path.join(c.globalConfig.sdks.ANDROID_SDK, 'platform-tools/adb');
        c.cli[CLI_TIZEN_EMULATOR] = path.join(c.globalConfig.sdks.TIZEN_SDK, 'tools/emulator/bin/em-cli');
        c.cli[CLI_TIZEN] = path.join(c.globalConfig.sdks.TIZEN_SDK, 'tools/ide/bin/tizen');
        c.cli[CLI_WEBOS_ARES] = path.join(c.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares');
        c.cli[CLI_WEBOS_ARES_PACKAGE] = path.join(c.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-package');
        c.cli[CLI_WEBBOS_ARES_INSTALL] = path.join(c.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-install');
        c.cli[CLI_WEBBOS_ARES_LAUNCH] = path.join(c.globalConfig.sdks.WEBOS_SDK, 'CLI/bin/ares-launch');
    }


    if (_currentJob === 'setup' || _currentJob === 'init') {
        console.log(chalk.white(`\n${LINE}\n ${RNV_START} ${chalk.white.bold(_currentJob)} is firing up! 🔥\n${LINE}\n`));

        resolve(c);
        return;
    }

    let appConfigFolder;

    if (_appConfigId) {
        // App ID specified
        c = Object.assign(c, _getConfig(_appConfigId));
    } else {
        // Use latest app from platfromAssets
        const cf = path.join(base, 'platformAssets/config.json');
        try {
            const assetConfig = JSON.parse(fs.readFileSync(cf).toString());
            c = Object.assign(c, _getConfig(assetConfig.id));
        } catch (e) {
            console.log(chalk.white(`\n${LINE}\n ${RNV_START} ${chalk.white.bold(_currentJob)} is firing up! 🔥\n${LINE}\n`));
            reject('ERROR: no app ID specified');
            return;
        }
    }


    console.log(chalk.white(`\n${LINE}\n ${RNV_START} ${chalk.white.bold(_currentJob)} is firing up ${chalk.white.bold(c.appId)} 🔥\n${LINE}\n`));

    resolve(c);
});

function isSdkInstalled(platform) {
    logTask(`isSdkInstalled: ${platform}`);

    if (c.globalConfig) {
        const sdkPlatform = SDK_PLATFORMS[platform];
        if (sdkPlatform) return fs.existsSync(c.globalConfig.sdks[sdkPlatform]);
    }

    return false;
}

const logTask = (task) => {
    console.log(chalk.yellow(`\n${RNV} ${_currentJob} - ${task} - Starting!`));
};

const logDebug = (...args) => {
    if (_isInfoEnabled) console.log.apply(null, args);
};

const logComplete = () => {
    console.log(chalk.white.bold(`\n ${RNV} ${_currentJob} - Done! 🚀 \n${LINE}\n`));
};

const logError = (e, process) => {
    console.log(`${chalk.red.bold(`\n${RNV} ${_currentJob} - ERRROR! ${e}`)}\n${LINE}\n`);
    _currentProcess.exit();
};

const _getConfig = (config) => {
    // logTask('getConfig');

    const c = JSON.parse(fs.readFileSync(path.join(base, 'config.json')).toString());
    const appConfigFolder = path.join(base, c.appConfigsFolder, config);
    const platformAssetsFolder = path.join(base, 'platformAssets');
    const platformBuildsFolder = path.join(base, 'platformBuilds');
    const platformTemplatesFolder = path.join(__dirname, '../platformTemplates');
    const appConfigPath = path.join(appConfigFolder, 'config.json');
    const appConfigFile = JSON.parse(fs.readFileSync(appConfigPath).toString());

    return {
        rootConfig: c,
        appId: config,
        appConfigFile,
        appConfigPath,
        appConfigFolder,
        platformAssetsFolder,
        platformBuildsFolder,
        platformTemplatesFolder,
    };
};

const checkConfig = appId => new Promise((resolve, reject) => {
    const rootConfig = JSON.parse(fs.readFileSync(path.join(base, 'config.json')).toString());
    let cf;
    if (appId) {
        cf = path.join(base, 'config.json');
    }
    cf = path.join(base, 'platformAssets/config.json');
    try {
        const c = JSON.parse(fs.readFileSync(cf).toString());
        resolve({
            rootConfig,
        });
    } catch (e) {
        resolve();
    }
});

const getAppFolder = (c, platform) => path.join(c.platformBuildsFolder, `${c.appId}_${platform}`);

const logErrorPlatform = (platform, resolve) => {
    console.log(`ERROR: Platform: ${chalk.bold(platform)} doesn't support command: ${chalk.bold(_currentJob)}`);
    resolve();
};

const isPlatformActive = (c, platform, resolve) => {
    if (!c.appConfigFile.platforms[platform]) {
        console.log(`Platform ${platform} not configured for ${c.appId}. skipping.`);
        resolve();
        return false;
    }
    return true;
};

export {
    SUPPORTED_PLATFORMS, isPlatformSupported, getAppFolder,
    logTask, logComplete, logError, initializeBuilder, logDebug, logErrorPlatform,
    isPlatformActive,
    IOS, ANDROID, ANDROID_TV, ANDROID_WEAR, WEB, TIZEN, TVOS, WEBOS, MACOS, WINDOWS,
    CLI_ANDROID_EMULATOR, CLI_ANDROID_ADB, CLI_TIZEN_EMULATOR, CLI_TIZEN, CLI_WEBOS_ARES, CLI_WEBOS_ARES_PACKAGE, CLI_WEBBOS_ARES_INSTALL, CLI_WEBBOS_ARES_LAUNCH,
};
