/* eslint-disable import/no-cycle */
// @todo fix cycle
import chalk from 'chalk';
import fs from 'fs';
import readline from 'readline';
import {
    logTask,
    SUPPORTED_PLATFORMS,
    getQuestion,
    askQuestion,
    finishQuestion,
    logSuccess,
} from '../common';
import { executePipe } from '../projectTools/buildHooks';

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

const run = (c) => {
    logTask('run');

    switch (c.subCommand) {
    case LIST:
        return executePipe(c, PIPES.PLUGIN_LIST_BEFORE)
            .then(() => _runList(c))
            .then(() => executePipe(c, PIPES.PLUGIN_LIST_AFTER));
    case ADD:
        executePipe(c, PIPES.PLUGIN_ADD_BEFORE);
        return _runAdd(c).then(() => executePipe(c, PIPES.PLUGIN_ADD_AFTER));
    case UPDATE:
        executePipe(c, PIPES.PLUGIN_UPDATE_BEFORE);
        return _runUpdate(c).then(() => executePipe(c, PIPES.PLUGIN_UPDATE_AFTER));
    default:
        return Promise.reject(`Sub-Command ${chalk.white.bold(c.subCommand)} not supported!`);
    }
};

// ##########################################
// PRIVATE
// ##########################################

const _runList = c => new Promise((resolve) => {
    logTask('_runList');

    const o = _getPluginList(c);

    console.log(o.asString);

    resolve();
});

const _getPluginList = (c, isUpdate = false) => {
    const { plugins } = c.files.pluginTemplatesConfig;
    const output = {
        asString: '',
        plugins: [],
        json: plugins,
    };

    let i = 1;

    Object.keys(plugins).forEach((k) => {
        const p = plugins[k];

        let platforms = '';
        SUPPORTED_PLATFORMS.forEach((v) => {
            if (p[v]) platforms += `${v}, `;
        });
        if (platforms.length) platforms = platforms.slice(0, platforms.length - 2);
        const installedPlugin = c.files.pluginConfig && c.files.pluginConfig.plugins && c.files.pluginConfig.plugins[k];
        const installedString = installedPlugin ? chalk.red('installed') : chalk.green('not installed');
        if (isUpdate && installedPlugin) {
            output.plugins.push(k);
            let versionString;
            if (installedPlugin.version !== p.version) {
                versionString = `(${chalk.red(installedPlugin.version)}) => (${chalk.green(p.version)})`;
            } else {
                versionString = `(${chalk.green(installedPlugin.version)})`;
            }
            output.asString += `-[${i}] ${chalk.white(k)} ${versionString}\n`;
            i++;
        } else if (!isUpdate) {
            output.plugins.push(k);
            output.asString += `-[${i}] ${chalk.white(k)} (${chalk.blue(p.version)}) [${platforms}] - ${installedString}\n`;
            i++;
        }
    });

    return output;
};

const _runAdd = c => new Promise((resolve) => {
    logTask('_runAdd');

    const o = _getPluginList(c);

    console.log(o.asString);

    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readlineInterface.question(getQuestion('Type plugin numbers you want to add (comma separated)'), (v) => {
        const choices = v.split(',');

        const selectedPlugins = {};
        let msg = 'Installing: \n';

        choices.forEach((choice) => {
            const i = parseInt(choice, 10) - 1;
            const key = o.plugins[i];
            if (key) {
                selectedPlugins[key] = o.json[key];
                msg += `- ${chalk.white(key)} v(${chalk.green(o.json[key].version)})\n`;
            }
        });
        console.log(msg);

        Object.keys(selectedPlugins).forEach((key) => {
            c.files.pluginConfig.plugins[key] = selectedPlugins[key];
            _checkAndAddDependantPlugins(c, selectedPlugins[key]);
        });

        fs.writeFileSync(c.paths.pluginConfigPath, JSON.stringify(c.files.pluginConfig, null, 2));

        logSuccess('Plugins installed successfully!');

        resolve();
    });
});

const _checkAndAddDependantPlugins = (c, plugin) => {
    const templatePlugins = c.files.pluginTemplatesConfig.plugins;
    if (plugin.dependsOn) {
        plugin.dependsOn.forEach((v) => {
            if (templatePlugins[v]) {
                console.log(`Added dependant plugin ${v}`);
                c.files.pluginConfig.plugins[v] = templatePlugins[v];
            }
        });
    }
};

const _runUpdate = c => new Promise((resolve) => {
    logTask('_runUpdate');

    const o = _getPluginList(c, true);

    console.log(o.asString);

    askQuestion('Above installed plugins will be updated with RNV. press (y) to confirm')
        .then((v) => {
            finishQuestion();
            const { plugins } = c.files.pluginConfig;
            Object.keys(plugins).forEach((key) => {
                c.files.pluginConfig.plugins[key] = o.json[key];
            });

            fs.writeFileSync(c.paths.pluginConfigPath, JSON.stringify(c.files.pluginConfig, null, 2));

            logSuccess('Plugins updated successfully!');

            resolve();
        });
});

export { PIPES };

export default run;
