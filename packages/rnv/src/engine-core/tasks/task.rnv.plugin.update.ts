import inquirer from 'inquirer';
import { writeFileSync } from '../../core/systemManager/fileutils';
import { logSuccess, logTask, logWarning } from '../../core/systemManager/logger';
import { getPluginList } from '../../core/pluginManager';
import { executeTask } from '../../core/taskManager';
import { TASK_PLUGIN_UPDATE, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';
import { RnvTaskFn } from '../../core/taskManager/types';

export const taskRnvPluginUpdate: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPluginUpdate');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLUGIN_UPDATE, originTask);

    const pluginList = getPluginList(c, true);

    // console.log(o.asString);

    const { confirm } = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message: 'Above installed plugins will be updated with RNV',
    });

    if (confirm) {
        const { plugins } = c.buildConfig;
        if (plugins) {
            Object.keys(plugins).forEach((key) => {
                // c.buildConfig.plugins[key] = o.json[key];
                c.files.project.config_original.plugins[key] = pluginList.json[key];
            });

            writeFileSync(c.paths.project.config, c.files.project.config_original);

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
