import path from 'path';
import axios from 'axios';
import ora from 'ora';
import { getConfigProp, confirmActiveBundler } from '../core/common';
import { chalk, logTask, logInfo } from '../core/systemManager/logger';
import { fsExistsSync, mkdirSync, writeFileSync, copyFileSync } from '../core/systemManager/fileutils';
import {
    TASK_START,
    RN_CLI_CONFIG_NAME
} from '../core/constants';
import { executeTask } from '../core/engineManager';


let keepRNVRunning = false;

export const startBundlerIfRequired = async (c, parentTask, originTask) => {
    logTask('startBundlerIfRequired');
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    if (bundleAssets === true) return;

    const isRunning = await isBundlerActive(c);
    if (!isRunning) {
        // _taskStart(c, parentTask, originTask);
        await executeTask(c, TASK_START, parentTask, originTask);

        keepRNVRunning = true;
        await waitForBundler(c);
    } else {
        await confirmActiveBundler(c);
    }
};

export const waitForBundlerIfRequired = async (c) => {
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    if (bundleAssets === true) return;
    // return a new promise that does...nothing, just to keep RNV running while the bundler is running
    if (keepRNVRunning) return new Promise(() => {});
    return true;
};

export const configureMetroConfigs = async (c, platform) => {
    const configDir = path.join(c.paths.project.dir, 'configs');
    if (!fsExistsSync(configDir)) {
        mkdirSync(configDir);
    }
    const dest = path.join(configDir, `metro.config.${platform}.js`);
    if (!fsExistsSync(dest)) {
        writeFileSync(
            dest,
            `const { Constants: { EXTENSIONS } } = require('rnv');
const config = require('../metro.config');

config.resolver.sourceExts = EXTENSIONS.${platform};
module.exports = config;
`
        );
    }


    // Check rn-cli-config
    if (!fsExistsSync(c.paths.project.rnCliConfig)) {
        logInfo(
            `Looks like your rn-cli config file ${chalk().white(
                c.paths.project.rnCliConfig
            )} is missing! Let's create one for you.`
        );
        copyFileSync(
            path.join(c.paths.rnv.projectTemplate.dir, RN_CLI_CONFIG_NAME),
            c.paths.project.rnCliConfig
        );
    }
};

const _isBundlerRunning = async (c) => {
    logTask('_isBundlerRunning');
    try {
        const { data } = await axios.get(
            `http://${c.runtime.localhost}:${c.runtime.port}/${getConfigProp(
                c,
                c.platform,
                'entryFile'
            )}.js`
        );
        if (data.includes('import')) {
            logTask('_isBundlerRunning', '(YES)');
            return true;
        }
        logTask('_isBundlerRunning', '(NO)');
        return false;
    } catch (e) {
        logTask('_isBundlerRunning', '(NO)');
        return false;
    }
};

export const isBundlerActive = async (c) => {
    logTask('isBundlerActive', `(http://${c.runtime.localhost}:${c.runtime.port})`);
    try {
        await axios.get(`http://${c.runtime.localhost}:${c.runtime.port}`);
        return true;
    } catch (e) {
        return false;
    }
};

const poll = (fn, timeout = 10000, interval = 1000) => {
    const endTime = Number(new Date()) + timeout;

    const spinner = ora('Waiting for bundler to finish...').start();
    const checkCondition = async (resolve, reject) => {
        try {
            const result = await fn();
            if (result) {
                spinner.succeed();
                resolve();
            } else if (Number(new Date()) < endTime) {
                setTimeout(checkCondition, interval, resolve, reject);
            } else {
                spinner.fail("Can't connect to bundler. Try restarting it.");
                reject("Can't connect to bundler. Try restarting it.");
            }
        } catch (e) {
            spinner.fail("Can't connect to bundler. Try restarting it.");
            reject(e);
        }
    };

    return new Promise(checkCondition);
};

export const waitForBundler = async c => poll(() => _isBundlerRunning(c));
