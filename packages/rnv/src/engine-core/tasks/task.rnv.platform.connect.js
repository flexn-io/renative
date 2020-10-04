import path from 'path';
import inquirer from 'inquirer';

import { chalk, logTask, logSuccess, logToSummary } from '../../core/systemManager/logger';
import {
    writeFileSync,
    removeDirs
} from '../../core/systemManager/fileutils';
import { generatePlatformChoices } from '../../core/platformManager';
import { executeTask } from '../../core/engineManager';
import { TASK_PROJECT_CONFIGURE, TASK_PLATFORM_CONNECT, PARAMS } from '../../core/constants';


export const taskRnvPlatformConnect = async (c, parentTask, originTask) => {
    logTask('taskRnvPlatformConnect');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_CONNECT, originTask);

    if (!c.files.project.config.paths.platformTemplatesDirs) {
        logToSummary('All supported platforms are connected. nothing to do.');
        return;
    }

    let selectedPlatforms;
    if (c.platform) {
        selectedPlatforms = [c.platform];
    } else {
        const { connectedPlatforms } = await inquirer.prompt({
            name: 'connectedPlatforms',
            message:
              'This will point platformTemplates folders from your local project to ReNative managed one. Select platforms you would like to connect',
            type: 'checkbox',
            choices: generatePlatformChoices(c).map(choice => ({
                ...choice,
                disabled: choice.isConnected
            }))
        });
        selectedPlatforms = connectedPlatforms;
    }


    if (selectedPlatforms.length) {
        selectedPlatforms.forEach((platform) => {
            if (c.files.project.config.paths.platformTemplatesDirs?.[platform]) {
                delete c.files.project.config.paths.platformTemplatesDirs[platform];
            }

            if (!Object.keys(c.files.project.config.paths.platformTemplatesDirs).length) {
                delete c.files.project.config.paths.platformTemplatesDirs; // also cleanup the empty object
            }

            writeFileSync(c.paths.project.config, c.files.project.config);
        });
    }

    const { deletePlatformFolder } = await inquirer.prompt({
        name: 'deletePlatformFolder',
        type: 'confirm',
        message:
            'Would you also like to delete the previously used platform folder?'
    });

    if (deletePlatformFolder) {
        const pathsToRemove = [];
        selectedPlatforms.forEach((platform) => {
            pathsToRemove.push(
                path.join(
                    c.paths.project.platformTemplatesDirs[platform],
                    platform
                )
            );
        });

        // TODO: Remove shared folders as well

        await removeDirs(pathsToRemove);
    }

    logSuccess(
        `${chalk().white(
            selectedPlatforms.join(',')
        )} now using ReNative platformTemplates located associated platform engines.`
    );
};

export default {
    description: 'Connect platform template back to rnv',
    fn: taskRnvPlatformConnect,
    task: TASK_PLATFORM_CONNECT,
    params: PARAMS.withBase(),
    platforms: [],
};
