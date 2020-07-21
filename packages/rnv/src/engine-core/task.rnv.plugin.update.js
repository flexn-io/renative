/* eslint-disable import/no-cycle */
import inquirer from 'inquirer';
import {
    writeFileSync
} from '../core/systemManager/fileutils';
import {
    logSuccess,
    logTask,
} from '../core/systemManager/logger';
import { getPluginList } from '../core/pluginManager';


export const taskRnvPluginUpdate = async (c, parentTask, originTask) => {
    logTask('taskRnvPluginUpdate', `parent:${parentTask} origin:${originTask}`);

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
    description: '',
    fn: taskRnvPluginUpdate,
    task: 'plugin update',
    params: [],
    platforms: [],
};
