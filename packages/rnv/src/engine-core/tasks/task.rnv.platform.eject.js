import path from 'path';
import inquirer from 'inquirer';
import { chalk, logTask, logSuccess, logError } from '../../core/systemManager/logger';
import { writeFileSync } from '../../core/systemManager/fileutils';
import { TASK_PLATFORM_EJECT, TASK_PROJECT_CONFIGURE, PARAMS } from '../../core/constants';
import { generatePlatformChoices } from '../../core/platformManager';
import { executeTask, getEngineRunnerByPlatform } from '../../core/engineManager';

export const taskRnvPlatformEject = async (c, parentTask, originTask) => {
    logTask('taskRnvPlatformEject');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_EJECT, originTask);
    let selectedPlatforms;
    if (c.platform) {
        selectedPlatforms = [c.platform];
    } else {
        const { ejectedPlatforms } = await inquirer.prompt({
            name: 'ejectedPlatforms',
            message:
              'This will copy platformTemplates folders from ReNative managed directly to your project Select platforms you would like to connect (use SPACE key)',
            type: 'checkbox',
            choices: generatePlatformChoices(c).map(choice => ({
                ...choice,
                disabled: !choice.isConnected
            }))
        });
        selectedPlatforms = ejectedPlatforms;
    }


    if (selectedPlatforms.length) {
        selectedPlatforms.forEach((platform) => {
            const engine = getEngineRunnerByPlatform(c, platform);
            const destDir = path.join(c.paths.project.dir, 'platformTemplates', platform);

            engine.ejectPlatform(c, platform, destDir);

            c.files.project.config.paths
                .platformTemplatesDirs = c.files.project.config.paths.platformTemplatesDirs || {};
            c.files.project.config.paths.platformTemplatesDirs[
                platform
            ] = `./${'platformTemplates'}`;
            writeFileSync(c.paths.project.config, c.files.project.config);
        });

        logSuccess(
            `${chalk().white(
                selectedPlatforms.join(',')
            )} platform templates are located in ${chalk().white(
                c.files.project.config.paths.platformTemplatesDirs[selectedPlatforms[0]]
            )} now. You can edit them directly!`
        );
    } else {
        logError(`You haven't selected any platform to eject.
TIP: You can select options with ${chalk().white('SPACE')} key before pressing ENTER!`);
    }
};

export default {
    description: 'Copy all platform files directly to project',
    fn: taskRnvPlatformEject,
    task: 'platform eject',
    params: PARAMS.withBase(),
    platforms: [],
};
