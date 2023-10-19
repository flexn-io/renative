import {
    writeFileSync,
    logSuccess,
    logTask,
    logWarning,
    getPluginList,
    executeTask,
    TASK_PLUGIN_UPDATE,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    inquirerPrompt,
} from '@rnv/core';

export const taskRnvPluginUpdate: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPluginUpdate');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLUGIN_UPDATE, originTask);

    const pluginList = getPluginList(c, true);

    // console.log(o.asString);

    const { confirm } = await inquirerPrompt({
        name: 'confirm',
        type: 'confirm',
        message: 'Above installed plugins will be updated with RNV',
    });

    if (confirm) {
        const { plugins } = c.buildConfig;
        if (plugins) {
            const cnf = c.files.project.config_original;

            if (!cnf) return;
            Object.keys(plugins).forEach((key) => {
                // c.buildConfig.plugins[key] = o.json[key];
                cnf.plugins = cnf.plugins || {};
                cnf.plugins[key] = pluginList.json[key];
            });

            writeFileSync(c.paths.project.config, cnf);

            logSuccess('Plugins updated successfully!');
        } else {
            logWarning(`No plugins found in renative.json`);
        }
    }
};

export default {
    description: 'Update specific plugin to latest supported version (rnv)',
    fn: taskRnvPluginUpdate,
    task: 'plugin update',
    params: PARAMS.withBase(),
    platforms: [],
};
