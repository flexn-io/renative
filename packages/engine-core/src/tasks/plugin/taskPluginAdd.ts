import {
    writeRenativeConfigFile,
    RnvTaskOptionPresets,
    chalk,
    logSuccess,
    logTask,
    resolvePluginDependants,
    executeTask,
    RnvTaskFn,
    PluginListResponseItem,
    getApi,
    inquirerPrompt,
    RenativeConfigPlugin,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { getPluginList } from '../../plugins';

/* eslint-disable no-await-in-loop */
const taskPluginAdd: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskPluginAdd');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.pluginAdd, originTask);

    const selPluginKey = c.program.rawArgs?.[4];

    const o = getPluginList();

    const selPlugin = selPluginKey && o.allPlugins[selPluginKey];
    const selectedPlugins: Record<string, PluginListResponseItem> = {};
    const installMessage = [];

    if (!selPlugin) {
        const { plugin } = await inquirerPrompt({
            name: 'plugin',
            type: 'rawlist',
            message: 'Select the plugins you want to add',
            choices: o.asArray,
            pageSize: 50,
        });

        selectedPlugins[plugin] = o.allPlugins[plugin];
        installMessage.push(`${chalk().bold(plugin)} v(${chalk().green(o.allPlugins[plugin].version)})`);
    } else {
        selectedPlugins[selPluginKey] = selPlugin;
        installMessage.push(`${chalk().bold(selPluginKey)} v(${chalk().green(selPlugin.version)})`);
    }

    const questionPlugins: Record<string, PluginListResponseItem> = {};

    const cnfOriginal = c.files.project.config_original;
    if (!cnfOriginal) {
        return;
    }

    const cnfPlugins = cnfOriginal.plugins || {};
    cnfOriginal.plugins = cnfPlugins;

    Object.keys(selectedPlugins).forEach((key) => {
        // c.buildConfig.plugins[key] = 'source:rnv';
        const plugin = selectedPlugins[key];
        if (plugin.props) questionPlugins[key] = plugin;

        cnfPlugins[key] = 'source:rnv';

        // c.buildConfig.plugins[key] = selectedPlugins[key];
    });

    const pluginKeys = Object.keys(questionPlugins);
    for (let i = 0; i < pluginKeys.length; i++) {
        const pluginKey = pluginKeys[i];
        const plugin = questionPlugins[pluginKey];
        const pluginProps = Object.keys(plugin.props || {});
        const finalProps: Record<string, string> = {};
        for (let i2 = 0; i2 < pluginProps.length; i2++) {
            const { propValue } = await inquirerPrompt({
                name: 'propValue',
                type: 'input',
                message: `${pluginKey}: Add value for ${pluginProps[i2]} (You can do this later in ./renative.json file)`,
            });
            finalProps[pluginProps[i2]] = propValue;
        }
        const pluginToAdd: RenativeConfigPlugin = {};
        pluginToAdd.props = finalProps;
        cnfPlugins[pluginKey] = pluginToAdd;
    }

    const spinner = getApi()
        .spinner(`Installing: ${installMessage.join(', ')}`)
        .start('');

    writeRenativeConfigFile(c.paths.project.config, cnfOriginal);

    await resolvePluginDependants();

    await executeTask(RnvTaskName.install, RnvTaskName.pluginAdd, originTask);

    spinner.succeed('All plugins installed!');
    logSuccess('Plugins installed successfully!');
    return true;
};

const Task: RnvTask = {
    description: 'Add selected plugin to the project',
    fn: taskPluginAdd,
    task: RnvTaskName.pluginAdd,
    options: RnvTaskOptionPresets.withBase(),
};

export default Task;
