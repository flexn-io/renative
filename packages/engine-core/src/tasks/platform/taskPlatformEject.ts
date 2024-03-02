import {
    chalk,
    logTask,
    logSuccess,
    logError,
    logInfo,
    writeFileSync,
    PARAMS,
    generatePlatformChoices,
    ejectPlatform,
    executeTask,
    RnvTaskFn,
    inquirerPrompt,
    PlatformKey,
    RnvTask,
} from '@rnv/core';
import { TASK_PROJECT_CONFIGURE } from '../project/constants';
import { TASK_PLATFORM_EJECT } from './constants';

export const taskRnvPlatformEject: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPlatformEject');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_EJECT, originTask);

    const configOriginal = c.files.project.config_original;

    if (!configOriginal) {
        return;
    }

    let selectedPlatforms: Array<PlatformKey>;
    if (c.platform) {
        selectedPlatforms = [c.platform];
    } else {
        logInfo(`Preparing to eject engine platforms to local ${chalk().white('./platformTemplates')}`);
        const { ejectedPlatforms } = await inquirerPrompt({
            name: 'ejectedPlatforms',
            message: 'Select platforms you would like to eject (use SPACE key)',
            type: 'checkbox',
            choices: generatePlatformChoices(c).map((choice) => ({
                ...choice,
                disabled: !choice.isConnected,
            })),
        });
        selectedPlatforms = ejectedPlatforms;
    }

    if (selectedPlatforms.length) {
        selectedPlatforms.forEach((platform) => {
            // const engine = getEngineRunnerByPlatform(c, platform);
            // const destDir = path.join(c.paths.project.dir, 'platformTemplates', platform);

            // engine.ejectPlatform(c, platform, destDir);
            ejectPlatform(c, platform);

            configOriginal.paths = configOriginal.paths || {};

            configOriginal.paths.platformTemplatesDirs = configOriginal.paths.platformTemplatesDirs || {};
            configOriginal.paths.platformTemplatesDirs[platform] = `./${'platformTemplates'}`;
            writeFileSync(c.paths.project.config, configOriginal);
        });

        logSuccess(
            `${chalk().white(selectedPlatforms.join(','))} platform templates are located in ${chalk().white(
                c.files.project.config?.paths?.platformTemplatesDirs?.[selectedPlatforms[0]]
            )} now. You can edit them directly!`
        );
    } else {
        logError(`You haven't selected any platform to eject.
TIP: You can select options with ${chalk().white('SPACE')} key before pressing ENTER!`);
    }
};

const Task: RnvTask = {
    description: 'Copy all platform files directly to project',
    fn: taskRnvPlatformEject,
    task: TASK_PLATFORM_EJECT,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
