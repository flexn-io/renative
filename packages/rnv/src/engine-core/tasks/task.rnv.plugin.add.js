import inquirer from 'inquirer';
import ora from 'ora';
import { writeRenativeConfigFile } from '../../core/configManager/configParser';
import { TASK_INSTALL, TASK_PLUGIN_ADD, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';
import {
    chalk,
    logSuccess,
    logTask
} from '../../core/systemManager/logger';
import { getPluginList, resolvePluginDependants } from '../../core/pluginManager';
import { executeTask } from '../../core/engineManager';


/* eslint-disable no-await-in-loop */
export const taskRnvPluginAdd = async (c, parentTask, originTask) => {
    logTask('taskRnvPluginAdd');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLUGIN_ADD, originTask);

    if (c.runtime.isWrapper) {
        return Promise.reject('Adding plugins in wrapper project is not supported.');
    }

    const selPluginKey = c.program.rawArgs[4];

    const o = getPluginList(c);

    const selPlugin = selPluginKey && o.allPlugins[selPluginKey];
    const selectedPlugins = {};
    const installMessage = [];

    if (!selPlugin) {
        const { plugin } = await inquirer.prompt({
            name: 'plugin',
            type: 'rawlist',
            message: 'Select the plugins you want to add',
            choices: o.asArray,
            pageSize: 50
        });

        selectedPlugins[plugin] = o.allPlugins[plugin];
        installMessage.push(
            `${chalk().white(plugin)} v(${chalk().green(
                o.allPlugins[plugin].version
            )})`
        );
    } else {
        selectedPlugins[selPluginKey] = selPlugin;
        installMessage.push(
            `${chalk().white(selPluginKey)} v(${chalk().green(selPlugin.version)})`
        );
    }

    const questionPlugins = {};

    Object.keys(selectedPlugins).forEach((key) => {
        // c.buildConfig.plugins[key] = 'source:rnv';
        const plugin = selectedPlugins[key];
        if (plugin.props) questionPlugins[key] = plugin;

        c.files.project.config.plugins[key] = 'source:rnv';

        // c.buildConfig.plugins[key] = selectedPlugins[key];
    });

    const pluginKeys = Object.keys(questionPlugins);
    for (let i = 0; i < pluginKeys.length; i++) {
        const pluginKey = pluginKeys[i];
        const plugin = questionPlugins[pluginKey];
        const pluginProps = Object.keys(plugin.props);
        const finalProps = {};
        for (let i2 = 0; i2 < pluginProps.length; i2++) {
            const { propValue } = await inquirer.prompt({
                name: 'propValue',
                type: 'input',
                message: `${pluginKey}: Add value for ${
                    pluginProps[i2]
                } (You can do this later in ./renative.json file)`
            });
            finalProps[pluginProps[i2]] = propValue;
        }
        c.files.project.config.plugins[pluginKey] = {};
        c.files.project.config.plugins[pluginKey].props = finalProps;
    }

    const spinner = ora(`Installing: ${installMessage.join(', ')}`).start();

    writeRenativeConfigFile(c, c.paths.project.config, c.files.project.config);

    await resolvePluginDependants(c);

    await executeTask(c, TASK_INSTALL, TASK_PLUGIN_ADD, originTask);

    spinner.succeed('All plugins installed!');
    logSuccess('Plugins installed successfully!');
    return true;
};

export default {
    description: 'Add selected plugin to the project',
    fn: taskRnvPluginAdd,
    task: 'plugin add',
    params: PARAMS.withBase(),
    platforms: [],
};
