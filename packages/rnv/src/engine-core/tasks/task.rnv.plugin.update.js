import inquirer from 'inquirer';
import {
    writeFileSync
} from '../../core/systemManager/fileutils';
import {
    logSuccess,
    logTask,
} from '../../core/systemManager/logger';
import { getPluginList } from '../../core/pluginManager';
import { executeTask } from '../../core/engineManager';
import { TASK_PLUGIN_UPDATE, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';


export const taskRnvPluginUpdate = async (c, parentTask, originTask) => {
    logTask('taskRnvPluginUpdate');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLUGIN_UPDATE, originTask);

    const o = getPluginList(c, true);

    // console.log(o.asString);

    const { confirm } = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message: 'Above installed plugins will be updated with RNV'
    });

    if (confirm) {
        const { plugins } = c.buildConfig;
        Object.keys(plugins).forEach((key) => {
            // c.buildConfig.plugins[key] = o.json[key];
            c.files.project.config.plugins[key] = o.json[key];
        });

        writeFileSync(c.paths.project.config, c.files.project.config);

        logSuccess('Plugins updated successfully!');
    }
};

export default {
    description: 'Update specific plugin to latest supported version (rnv)',
    fn: taskRnvPluginUpdate,
    task: 'plugin update',
    params: PARAMS.withBase(),
    platforms: [],
};
