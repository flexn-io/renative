import {
    chalk,
    logTask,
    logSuccess,
    logError,
    logInfo,
    writeFileSync,
    generatePlatformChoices,
    ejectPlatform,
    executeTask,
    RnvTaskFn,
    inquirerPrompt,
    PlatformKey,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskPlatformEject');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.platformEject, originTask);

    const configOriginal = c.files.project.config_original;

    if (!configOriginal) {
        return;
    }

    let selectedPlatforms: Array<PlatformKey>;
    if (c.platform) {
        selectedPlatforms = [c.platform];
    } else {
        logInfo(`Preparing to eject engine platforms to local ${chalk().bold('./platformTemplates')}`);
        const { ejectedPlatforms } = await inquirerPrompt({
            name: 'ejectedPlatforms',
            message: 'Select platforms you would like to eject (use SPACE key)',
            type: 'checkbox',
            choices: generatePlatformChoices().map((choice) => ({
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
            ejectPlatform(platform);

            configOriginal.paths = configOriginal.paths || {};

            configOriginal.paths.platformTemplatesDirs = configOriginal.paths.platformTemplatesDirs || {};
            configOriginal.paths.platformTemplatesDirs[platform] = `./${'platformTemplates'}`;
            writeFileSync(c.paths.project.config, configOriginal);
        });

        logSuccess(
            `${chalk().bold(selectedPlatforms.join(','))} platform templates are located in ${chalk().bold(
                c.files.project.config?.paths?.platformTemplatesDirs?.[selectedPlatforms[0]]
            )} now. You can edit them directly!`
        );
    } else {
        logError(`You haven't selected any platform to eject.
TIP: You can select options with ${chalk().bold('SPACE')} key before pressing ENTER!`);
    }
};

const Task: RnvTask = {
    description: 'Copy all platform files directly to project',
    fn: async () => {},
    task: RnvTaskName.platformEject,
};

export default Task;
