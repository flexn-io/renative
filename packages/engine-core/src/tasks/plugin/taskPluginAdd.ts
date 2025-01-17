import {
    writeRenativeConfigFile,
    chalk,
    logSuccess,
    resolvePluginDependants,
    PluginListResponseItem,
    getApi,
    inquirerPrompt,
    ConfigPluginSchema,
    createTask,
    RnvTaskName,
} from '@rnv/core';
import { checkAndInstallIfRequired } from '../../taskHelpers';
import { getPluginList } from './taskHelpers';

/**
 * CLI command `npx rnv plugin add` triggers this task, which allows to add plugin to the project by selecting from a list of available plugins.
 * It handles both the selection process via a command-line prompt and the configuration update required
 * to integrate the selected plugins into the project. The task ensures that any dependencies required
 * by the plugins are resolved and installed.
 * - If a plugin key is provided as a command-line argument, the task will use it to select the plugin directly.
 * - If no plugin key is provided, the task will prompt the user to select a plugin from a list.
 * - The task then updates the project's configuration file to include the selected plugins.
 * - If a plugin requires additional properties, the user will be prompted to input values for these properties.
 * - The task installs the plugins and any necessary dependencies, displaying a success message upon completion.
 *
 * Dependencies:
 * - This task depends on the 'projectConfigure' task.
 *
 * Returns:
 * - A boolean indicating the success of the plugin addition process.
 *
 * Note:
 * - Plugin properties can be manually edited later in the './renative.json' file.
 */
export default createTask({
    description: 'Add selected plugin to the project',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const selPluginKey = ctx.program.rawArgs?.[4];

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
            installMessage.push(`${chalk().bold.white(plugin)} v(${chalk().green(o.allPlugins[plugin].version)})`);
        } else {
            selectedPlugins[selPluginKey] = selPlugin;
            installMessage.push(`${chalk().bold.white(selPluginKey)} v(${chalk().green(selPlugin.version)})`);
        }

        const questionPlugins: Record<string, PluginListResponseItem> = {};

        const cnfOriginal = ctx.files.project.config_original;
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
            const pluginToAdd: ConfigPluginSchema = {};
            pluginToAdd.props = finalProps;
            cnfPlugins[pluginKey] = pluginToAdd;
        }

        const spinner = getApi()
            .spinner(`Installing: ${installMessage.join(', ')}`)
            .start('');

        writeRenativeConfigFile(ctx.paths.project.config, cnfOriginal);

        await resolvePluginDependants();
        await checkAndInstallIfRequired();

        spinner.succeed('All plugins installed!');
        logSuccess('Plugins installed successfully!');
        return true;
    },
    task: RnvTaskName.pluginAdd,
});
