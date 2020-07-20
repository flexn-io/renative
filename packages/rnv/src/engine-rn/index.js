/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import { getConfigProp, confirmActiveBundler } from '../core/common';
import { chalk, logTask, logInfo } from '../core/systemManager/logger';
import {
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG, TASK_CONFIGURE,
    RN_CLI_CONFIG_NAME
} from '../core/constants';
import { isBundlerActive, waitForBundler } from './bundler';
import { mkdirSync, writeFileSync, copyFileSync } from '../core/systemManager/fileutils';
import { executeTask as _executeTask } from '../core/engineManager';
import { taskRnvRun } from './task.rnv.run';
import { taskRnvPackage } from './task.rnv.package';
import { taskRnvBuild } from './task.rnv.build';
import { taskRnvConfigure } from './task.rnv.configure';
import { taskRnvStart } from './task.rnv.start';
import { taskRnvExport } from './task.rnv.export';
import { taskRnvDeploy } from './task.rnv.deploy';
import { taskRnvDebug } from './task.rnv.debug';
import { taskRnvLog } from './task.rnv.log';

const TASKS = {};
TASKS[TASK_RUN] = taskRnvRun;
TASKS[TASK_PACKAGE] = taskRnvPackage;
TASKS[TASK_BUILD] = taskRnvBuild;
TASKS[TASK_CONFIGURE] = taskRnvConfigure;
TASKS[TASK_START] = taskRnvStart;
TASKS[TASK_EXPORT] = taskRnvExport;
TASKS[TASK_DEPLOY] = taskRnvDeploy;
TASKS[TASK_DEBUG] = taskRnvDebug;
TASKS[TASK_LOG] = taskRnvLog;


let keepRNVRunning = false;

export const startBundlerIfRequired = async (c, parentTask, originTask) => {
    logTask('startBundlerIfRequired');
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    if (bundleAssets === true) return;

    const isRunning = await isBundlerActive(c);
    if (!isRunning) {
        // _taskStart(c, parentTask, originTask);
        await _executeTask(c, TASK_START, parentTask, originTask);

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

const _configureMetroConfigs = async (c, platform) => {
    const configDir = path.join(c.paths.project.dir, 'configs');
    if (!fs.existsSync(configDir)) {
        mkdirSync(configDir);
    }
    const dest = path.join(configDir, `metro.config.${platform}.js`);
    if (!fs.existsSync(dest)) {
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
    if (!fs.existsSync(c.paths.project.rnCliConfig)) {
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

const executeTask = async (c, task, parentTask, originTask) => TASKS[task](c, parentTask, originTask);

const applyTemplate = async (c) => {
    await _configureMetroConfigs(c, c.platform);
    return true;
};

export default {
    executeTask,
    applyTemplate
};
