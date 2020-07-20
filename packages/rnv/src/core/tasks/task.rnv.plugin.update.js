/* eslint-disable import/no-cycle */
import inquirer from 'inquirer';
import {
    writeFileSync
} from '../systemManager/fileutils';
import {
    logSuccess,
    logTask,
} from '../systemManager/logger';
import { getPluginList } from '../pluginManager';


export const taskRnvPluginUpdate = async (c) => {
    logTask('taskRnvPluginUpdate');

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
