import path from 'path';
import axios from 'axios';
import ora from 'ora';
import { getConfigProp, confirmActiveBundler, getAppFolder, getTemplateDir } from '../core/common';
import { chalk, logTask, logInfo, logWarning } from '../core/systemManager/logger';
import { fsExistsSync, copyFileSync, copyFolderContentsRecursiveSync } from '../core/systemManager/fileutils';
import { TASK_START, RN_CLI_CONFIG_NAME } from '../core/constants';
import { executeTask } from '../core/engineManager';

let keepRNVRunning = false;

export const getPlatformBuildDir = c => getAppFolder(c);

export const getPlatformOutputDir = (c) => {
    const dir = getPlatformBuildDir(c);
    let output;
    switch (c.platform) {
        default:
            output = dir;
    }
    return output;
};

export const getTemplateProjectDir = (c) => {
    const dir = getTemplateDir(c);
    let output;
    switch (c.platform) {
        default:
            output = dir;
    }
    return output;
};

export const getTemplateRootDir = (c, platform) => {
    const dir = c.paths.project.platformTemplatesDirs[platform];
    return dir;
};

export const ejectPlatform = (c, platform, destFolder) => {
    const sourcePlatformDir = getTemplateRootDir(c, platform);
    copyFolderContentsRecursiveSync(
        path.join(sourcePlatformDir, platform),
        destFolder
    );
    copyFolderContentsRecursiveSync(
        path.join(sourcePlatformDir, '_shared'),
        destFolder
    );
};

export const getPlatformProjectDir = (c) => {
    const dir = getPlatformBuildDir(c);
    let output;
    switch (c.platform) {
        default:
            output = dir;
    }
    return output;
};

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
        const resetCompleted = await confirmActiveBundler(c);
        if (resetCompleted) {
            await executeTask(c, TASK_START, parentTask, originTask);

            keepRNVRunning = true;
            await waitForBundler(c);
        }
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
    logTask('configureMetroConfigs');

    const cfPath = path.join(c.paths.project.dir, 'configs', `metro.config.${platform}.js`);
    if (fsExistsSync(cfPath)) {
        logWarning(`${chalk().white(cfPath)} is DEPRECATED. use withRnvMetro(config) directly in /.metro.config.js`);
    }


    // Check rn-cli-config
    if (!fsExistsSync(c.paths.project.rnCliConfig)) {
        logInfo(
            `Your rn-cli config file ${chalk().white(
                c.paths.project.rnCliConfig
            )} is missing! INSTALLING...DONE`
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
