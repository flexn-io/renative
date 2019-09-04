/* eslint-disable import/no-cycle */
// @todo fix cycle
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { SUPPORTED_PLATFORMS } from '../constants';
import {
    logTask,
    logSuccess,
} from '../common';
import { executePipe } from '../projectTools/buildHooks';
import { writeObjectSync } from '../systemTools/fileutils';

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
        return Promise.reject(`cli:plugin: Sub-Command ${chalk.white.bold(c.subCommand)} not supported!`);
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
    const { plugins } = c.files.rnv.pluginTemplates.config;
    const output = {
        asString: '',
        asArray: [],
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
        const installedPlugin = c.buildConfig && c.buildConfig.plugins && c.buildConfig.plugins[k];
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
            output.asArray.push({ name: `${k} ${versionString}`, value: k });
            i++;
        } else if (!isUpdate) {
            output.plugins.push(k);
            output.asString += `-[${i}] ${chalk.white(k)} (${chalk.blue(p.version)}) [${platforms}] - ${installedString}\n`;
            output.asArray.push({ name: `${k} (${chalk.blue(p.version)}) [${platforms}] - ${installedString}`, value: k });
            i++;
        }
    });

    return output;
};

const _runAdd = async (c) => {
    logTask('_runAdd');

    const o = _getPluginList(c);

    const { plugins } = await inquirer.prompt({
        name: 'plugins',
        type: 'checkbox',
        message: 'Select the plugins you want to add',
        choices: o.asArray
    });

    const installMessage = [];

    if (plugins.length) {
        const selectedPlugins = {};
        plugins.forEach((plugin) => {
            selectedPlugins[plugin] = o.json[plugin];
            installMessage.push(`${chalk.white(plugin)} v(${chalk.green(o.json[plugin].version)})`);
        });

        const spinner = ora(`Installing: ${installMessage.join(', ')}`).start();

        Object.keys(selectedPlugins).forEach((key) => {
            // c.buildConfig.plugins[key] = 'source:rnv';
            c.files.project.config.plugins[key] = 'source:rnv';

            // c.buildConfig.plugins[key] = selectedPlugins[key];
            _checkAndAddDependantPlugins(c, selectedPlugins[key]);
        });

        writeObjectSync(c.paths.project.config, c.files.project.config);
        spinner.succeed('All plugins installed!');
        logSuccess('Plugins installed successfully!');
    }
};

const _checkAndAddDependantPlugins = (c, plugin) => {
    const templatePlugins = c.files.rnv.pluginTemplates.config.plugins;
    if (plugin.dependsOn) {
        plugin.dependsOn.forEach((v) => {
            if (templatePlugins[v]) {
                console.log(`Added dependant plugin ${v}`);
                c.buildConfig.plugins[v] = templatePlugins[v];
            }
        });
    }
};

const _runUpdate = async (c) => {
    logTask('_runUpdate');

    const o = _getPluginList(c, true);

    console.log(o.asString);

    const { confirm } = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message: 'Above installed plugins will be updated with RNV',
    });

    if (confirm) {
        const { plugins } = c.buildConfig;
        Object.keys(plugins).forEach((key) => {
            // c.buildConfig.plugins[key] = o.json[key];
            c.files.project.config.plugins[key] = o.json[key];
        });

        writeObjectSync(c.paths.project.config, c.files.project.config);

        logSuccess('Plugins updated successfully!');
    }
};

export { PIPES };

export default run;
