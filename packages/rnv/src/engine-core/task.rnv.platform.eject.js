import path from 'path';
import inquirer from 'inquirer';
import { chalk, logTask, logSuccess, logError } from '../core/systemManager/logger';
import { copyFolderContentsRecursiveSync, writeFileSync } from '../core/systemManager/fileutils';
import { PLATFORMS, TASK_PLATFORM_EJECT, TASK_PROJECT_CONFIGURE, PARAMS } from '../core/constants';
import { generatePlatformChoices } from '../core/platformManager';
import { executeTask } from '../core/engineManager';


export const taskRnvPlatformEject = async (c, parentTask, originTask) => {
    logTask('taskRnvPlatformEject');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_EJECT, originTask);

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

    if (ejectedPlatforms.length) {
        const ptfn = 'platformTemplates';
        const rptf = c.paths.rnv.platformTemplates.dir;
        const prf = c.paths.project.dir;

        let copyShared = false;

        ejectedPlatforms.forEach((platform) => {
            if (PLATFORMS[platform].requiresSharedConfig) {
                copyShared = true;
            }
            copyFolderContentsRecursiveSync(
                path.join(rptf, platform),
                path.join(prf, ptfn, platform)
            );

            if (copyShared) {
                copyFolderContentsRecursiveSync(
                    path.join(rptf, '_shared'),
                    path.join(prf, ptfn, platform)
                );
            }

            c.files.project.config.paths
                .platformTemplatesDirs = c.files.project.config.paths.platformTemplatesDirs || {};
            c.files.project.config.paths.platformTemplatesDirs[
                platform
            ] = `./${ptfn}`;
            writeFileSync(c.paths.project.config, c.files.project.config);
        });

        logSuccess(
            `${chalk().white(
                ejectedPlatforms.join(',')
            )} platform templates are located in ${chalk().white(
                c.files.project.config.paths.platformTemplatesDirs[ejectedPlatforms[0]]
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
