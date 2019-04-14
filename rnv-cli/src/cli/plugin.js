import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError, getAppFolder,
    SUPPORTED_PLATFORMS, getQuestion, logSuccess,
} from '../common';
import { IOS, ANDROID, TVOS, TIZEN, WEBOS, ANDROID_TV, ANDROID_WEAR, KAIOS } from '../constants';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync } from '../fileutils';
import { launchTizenSimulator } from '../platformTools/tizen';
import { launchWebOSimulator } from '../platformTools/webos';
import { launchAndroidSimulator, listAndroidTargets } from '../platformTools/android';
import { launchKaiOSSimulator } from '../platformTools/kaios';

const LIST = 'list';
const ADD = 'add';

const PIPES = {
    PLUGIN_LIST_BEFORE: 'plugin:list:before',
    PLUGIN_LIST_AFTER: 'plugin:list:after',
    PLUGIN_ADD_BEFORE: 'plugin:add:before',
    PLUGIN_ADD_AFTER: 'plugin:add:after',
};


// ##########################################
// PUBLIC API
// ##########################################

const run = c => new Promise((resolve, reject) => {
    logTask('run');

    switch (c.subCommand) {
    case LIST:
        _runList(c).then(() => resolve()).catch(e => reject(e));
        return;
    case ADD:
        _runAdd(c).then(() => resolve()).catch(e => reject(e));
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

const _getPluginList = (c, platform) => {
    const plugins = JSON.parse(fs.readFileSync(path.join(c.rnvPluginTemplatesConfigPath)).toString()).plugins;
    const output = {
        asString: '',
        plugins: [],
        json: plugins,
    };

    let i = 1;
    for (const k in plugins) {
        const p = plugins[k];

        platforms = '';
        SUPPORTED_PLATFORMS.forEach((v) => {
            if (p[v]) platforms += `${v}, `;
        });
        if (platforms.length) platforms = platforms.slice(0, platforms.length - 2);
        output.plugins.push(k);
        output.asString += `-[${i}] ${chalk.white(k)} (${platforms}) - ${chalk.green('not installed')}\n`;
        i++;
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

        fs.writeFileSync(c.pluginConfigPath, JSON.stringify(c.pluginConfig, null, 2));

        logSuccess('Plugins installed successfully!');

        resolve();
    });
});

export { PIPES };

export default run;
