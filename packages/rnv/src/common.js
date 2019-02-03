import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { cleanFolder } from './fileutils';

const SUPPORTED_PLATFORMS = ['all', 'ios', 'android', 'web', 'tizen'];
const RNV = 'RNV';
const LINE = '-----------------------------';

let _currentJob;
let _currentProcess;

const base = path.resolve('.');

const isPlatformSupported = (platform) => {
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
        console.warn(chalk.yellow(`Warning: Platform ${platform} is not supported`));
        return false;
    }
    return true;
};

const setCurrentJob = (cmd, process) => {
    _currentJob = cmd;
    _currentProcess = process;
};

const logTask = (task) => {
    console.log(chalk.yellow(`\n${RNV} ${_currentJob} - ${task} - Starting!`));
};

const logStart = () => {
    console.log(chalk.white.bold(`\n${LINE}\n RNV is Firing Up!!! 🔥\n${LINE}\n`));
};

const logComplete = () => {
    console.log(chalk.white.bold(`\n ${RNV} ${_currentJob} - Done! 🍺 \n${LINE}\n`));
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
    const pth = path.join(appConfigFolder, 'config.json');
    const appConfigFile = JSON.parse(fs.readFileSync(pth).toString());

    resolve({
        appId: config,
        appConfigFile,
        appConfigFolder,
        platformAssetsFolder,
        platformBuildsFolder,
    });
});

export {
    SUPPORTED_PLATFORMS, isPlatformSupported, setCurrentJob,
    logTask, logComplete, logError, getConfig, logStart,
};
