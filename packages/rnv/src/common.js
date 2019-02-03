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

const initializeBuilder = (cmd, process, program) => new Promise((resolve, reject) => {
    _currentJob = cmd;
    _currentProcess = process;
    _isInfoEnabled = program.info === true;

    checkConfig().then((v) => {
        if (v) {
            console.log(chalk.white(`\n${LINE}\n ${RNV} ${chalk.white.bold(_currentJob)} is firing up ${chalk.white.bold(v.id)} 🔥\n${LINE}\n`));
        } else {
            console.log(chalk.white(`\n${LINE}\n ${RNV} ${chalk.white.bold(_currentJob)} is firing up! 🔥\n${LINE}\n`));
        }

        resolve(v);
    });
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

const getConfig = config => new Promise((resolve, reject) => {
    logTask('getConfig');

    const c = JSON.parse(fs.readFileSync(path.join(base, 'config.json')).toString());
    const appConfigFolder = path.join(base, c.appConfigsFolder, config);
    const platformAssetsFolder = path.join(base, 'platformAssets');
    const platformBuildsFolder = path.join(base, 'platformBuilds');
    const platformTemplatesFolder = path.join(__dirname, '../platformTemplates');
    const appConfigPath = path.join(appConfigFolder, 'config.json');
    const appConfigFile = JSON.parse(fs.readFileSync(appConfigPath).toString());

    resolve({
        appId: config,
        appConfigFile,
        appConfigPath,
        appConfigFolder,
        platformAssetsFolder,
        platformBuildsFolder,
        platformTemplatesFolder,
    });
});

const checkConfig = () => new Promise((resolve, reject) => {
    const cf = path.join(base, 'platformAssets/config.json');
    try {
        const c = JSON.parse(fs.readFileSync(cf).toString());
        resolve(c);
    } catch (e) {
        resolve();
    }
});

const getAppFolder = (c, platform) => path.join(c.platformBuildsFolder, `${c.appId}_${platform}`);

export {
    SUPPORTED_PLATFORMS, IOS, TVOS, ANDROID, isPlatformSupported, getAppFolder,
    logTask, logComplete, logError, getConfig, initializeBuilder, logDebug,
};
