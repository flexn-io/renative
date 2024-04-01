import {
    chalk,
    logSuccess,
    logError,
    logInfo,
    writeFileSync,
    generatePlatformChoices,
    ejectPlatform,
    inquirerPrompt,
    RnvPlatformKey,
    createTask,
    RnvTaskName,
} from '@rnv/core';

export default createTask({
    description: 'Copy all platform files directly to project',
    fn: async ({ ctx }) => {
        const configOriginal = ctx.files.project.config_original;

        if (!configOriginal) {
            return;
        }

        let selectedPlatforms: Array<RnvPlatformKey>;
        if (ctx.platform) {
            selectedPlatforms = [ctx.platform];
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
                writeFileSync(ctx.paths.project.config, configOriginal);
            });

            logSuccess(
                `${chalk().bold(selectedPlatforms.join(','))} platform templates are located in ${chalk().bold(
                    ctx.files.project.config?.paths?.platformTemplatesDirs?.[selectedPlatforms[0]]
                )} now. You can edit them directly!`
            );
        } else {
            logError(`You haven't selected any platform to eject.
TIP: You can select options with ${chalk().bold('SPACE')} key before pressing ENTER!`);
        }
    },
    task: RnvTaskName.platformEject,
});
