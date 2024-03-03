import {
    writeFileSync,
    logSuccess,
    logTask,
    logWarning,
    executeTask,
    PARAMS,
    RnvTaskFn,
    inquirerPrompt,
    RnvTask,
    TaskKey,
} from '@rnv/core';

export const taskRnvPluginUpdate: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPluginUpdate');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.pluginUpdate, originTask);

    // const pluginList = getPluginList(c, true);

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
            Object.keys(plugins).forEach((_key) => {
                //TODO: fix this. not working
                // c.buildConfig.plugins[key] = o.json[key];
                cnf.plugins = cnf.plugins || {};
                // cnf.plugins[key] = pluginList.json[key];
            });

            writeFileSync(c.paths.project.config, cnf);

            logSuccess('Plugins updated successfully!');
        } else {
            logWarning(`No plugins found in renative.json`);
        }
    }
};

const Task: RnvTask = {
    description: 'Update specific plugin to latest supported version (rnv)',
    fn: taskRnvPluginUpdate,
    task: TaskKey.pluginUpdate,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;