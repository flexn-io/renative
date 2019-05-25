import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import {
    isPlatformSupportedSync,
    getConfig,
    logTask,
    logComplete,
    logError,
    getAppFolder,
    SUPPORTED_PLATFORMS,
    getQuestion,
    logSuccess,
} from '../common';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS } from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';
import { launchTizenSimulator } from '../platformTools/tizen';
import { launchWebOSimulator } from '../platformTools/webos';
import { launchAndroidSimulator, listAndroidTargets } from '../platformTools/android';
import { launchKaiOSSimulator } from '../platformTools/firefox';
import { executePipe } from '../buildHooks';

const LIST = 'list';
const ADD = 'add';
const UPDATE = 'update';

const PIPES = {
    PLUGIN_LIST_BEFORE: 'plugin:list:before',
    PLUGIN_LIST_AFTER: 'plugin:list:after',
    PLUGIN_ADD_BEFORE: 'plugin:add:before',
    PLUGIN_ADD_AFTER: 'plugin:add:after',
    PLUGIN_UPDATE_BEFORE: 'plugin:update:before',
    PLUGIN_UPDATE_AFTER: 'plugin:update:after',
};

// ##########################################
// PUBLIC API
// ##########################################

const run = c => new Promise((resolve, reject) => {
    logTask('run');

    switch (c.subCommand) {
    case LIST:
        executePipe(c, PIPES.PLUGIN_LIST_BEFORE)
            .then(() => _runList(c))
            .then(() => executePipe(c, PIPES.PLUGIN_LIST_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case ADD:
        executePipe(c, PIPES.PLUGIN_ADD_BEFORE);
        _runAdd(c)
            .then(() => executePipe(c, PIPES.PLUGIN_ADD_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    case UPDATE:
        executePipe(c, PIPES.PLUGIN_UPDATE_BEFORE);
        _runUpdate(c)
            .then(() => executePipe(c, PIPES.PLUGIN_UPDATE_AFTER))
            .then(() => resolve())
            .catch(e => reject(e));
        return;
    default:
        return Promise.reject(`Sub-Command ${chalk.white.bold(c.subCommand)} not supported!`);
    }
});

// ##########################################
// PRIVATE
// ##########################################

const _runList = c => new Promise((resolve, reject) => {
    logTask('_runList');
    const { platform, program } = c;

    const o = _getPluginList(c, platform);

    console.log(o.asString);

    resolve();
});

const _getPluginList = (c, platform, isUpdate = false) => {
    const plugins = JSON.parse(fs.readFileSync(path.join(c.paths.rnvPluginTemplatesConfigPath)).toString()).plugins;
    const output = {
        asString: '',
        plugins: [],
        json: plugins,
    };

    let i = 1;
    const projectPlugins = c.projectPlugins;
    for (const k in plugins) {
        const p = plugins[k];

        platforms = '';
        SUPPORTED_PLATFORMS.forEach((v) => {
            if (p[v]) platforms += `${v}, `;
        });
        if (platforms.length) platforms = platforms.slice(0, platforms.length - 2);
        const installedPlugin = c.pluginConfig && c.pluginConfig.plugins && c.pluginConfig.plugins[k];
        const installedString = installedPlugin ? chalk.red('installed') : chalk.green('not installed');
        if (isUpdate && installedPlugin) {
            output.plugins.push(k);
            output.asString += `-[${i}] ${chalk.white(k)} (${chalk.red(installedPlugin.version)}) => (${chalk.green(
                p.version
            )})\n`;
            i++;
        } else if (!isUpdate) {
            output.plugins.push(k);
            output.asString += `-[${i}] ${chalk.white(k)} (${chalk.blue(p.version)}) [${platforms}] - ${installedString}\n`;
            i++;
        }
    }
    return output;
};

const _runAdd = c => new Promise((resolve, reject) => {
    logTask('_runAdd');

    const o = _getPluginList(c, platform);

    console.log(o.asString);

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question(getQuestion('Type plugin numbers you want to add (comma separated)'), (v) => {
        const choices = v.split(',');

        const selectedPlugins = {};
        let msg = 'Installing: \n';

        choices.forEach((v) => {
            const i = parseInt(v, 10) - 1;
            const key = o.plugins[i];
            if (key) {
                selectedPlugins[key] = o.json[key];
                msg += `- ${chalk.white(key)} v(${chalk.green(o.json[key].version)})\n`;
            }
        });
        console.log(msg);

        for (const k in selectedPlugins) {
            c.pluginConfig.plugins[k] = selectedPlugins[k];
        }

        fs.writeFileSync(c.paths.pluginConfigPath, JSON.stringify(c.pluginConfig, null, 2));

        logSuccess('Plugins installed successfully!');

        resolve();
    });
});

const _runUpdate = c => new Promise((resolve, reject) => {
    logTask('_runUpdate');

    const o = _getPluginList(c, platform, true);

    console.log(o.asString);

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question(getQuestion('Above installed plugins will be updated with RNV. press (y) to confirm'), (v) => {
        const choices = v.split(',');

        for (const k in c.pluginConfig.plugins) {
            c.pluginConfig.plugins[k] = o.json[k];
        }

        fs.writeFileSync(c.paths.pluginConfigPath, JSON.stringify(c.pluginConfig, null, 2));

        logSuccess('Plugins updated successfully!');

        resolve();
    });
});

export { PIPES };

export default run;
