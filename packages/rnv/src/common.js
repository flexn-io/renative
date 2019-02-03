import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { cleanFolder } from './fileutils';

const IOS = 'ios';
const TVOS = 'tvos';
const ANDROID = 'android';
const SUPPORTED_PLATFORMS = ['all', IOS, ANDROID, 'web', 'tizen', TVOS];
const RNV = 'RNV';
const LINE = '----------------------------------------------------------';

let _currentJob;
let _currentProcess;
let _isInfoEnabled = false;

const base = path.resolve('.');

const isPlatformSupported = (platform, resolve) => {
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
        console.warn(chalk.yellow(`Warning: Platform ${platform} is not supported`));
        resolve();
        return false;
    }
    return true;
};

const initializeBuilder = (cmd, appId, process, program) => new Promise((resolve, reject) => {
    _currentJob = cmd;
    _currentProcess = process;
    _isInfoEnabled = program.info === true;

    const rootConfig = JSON.parse(fs.readFileSync(path.join(base, 'config.json')).toString());
    const platformAssetsFolder = path.join(base, 'platformAssets');
    const platformBuildsFolder = path.join(base, 'platformBuilds');
    const platformTemplatesFolder = path.join(__dirname, '../platformTemplates');

    let appConfigFolder;
    let c;
    if (appId) {
        // App ID specified
        c = _getConfig(appId);
    } else {
        // Use latest app from platfromAssets
        const cf = path.join(base, 'platformAssets/config.json');
        try {
            const assetConfig = JSON.parse(fs.readFileSync(cf).toString());
            c = _getConfig(assetConfig.id);
        } catch (e) {
            console.log('ERROR: no app ID specified');
        }
    }
    c.program = program;
    c.process = process;
    c.platform = program.platform;

    console.log(chalk.white(`\n${LINE}\n ${RNV} ${chalk.white.bold(_currentJob)} is firing up ${chalk.white.bold(c.appId)} 🔥\n${LINE}\n`));

    resolve(c);
});

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
    console.log(chalk.red.bold(`\n${RNV} ${_currentJob} - ERRROR! ${e} \n${LINE}\n`));
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

const getAppFolder = c => path.join(c.platformBuildsFolder, `${c.appId}_${c.platform}`);

const logErrorPlatform = (platform, resolve) => {
    console.log(`ERROR: Platform: ${chalk.bold(platform)} doesn't support command: ${chalk.bold(_currentJob)}`);
    resolve();
};

export {
    SUPPORTED_PLATFORMS, IOS, TVOS, ANDROID, isPlatformSupported, getAppFolder,
    logTask, logComplete, logError, initializeBuilder, logDebug, logErrorPlatform,
};
