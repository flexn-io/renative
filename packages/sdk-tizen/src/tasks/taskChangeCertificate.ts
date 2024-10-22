import { createTask, inquirerPrompt, logInfo, RnvTaskName } from '@rnv/core';
import fs from 'fs';
import { checkTizenStudioCert } from '../runner';

export default createTask({
    description: 'Change tizen certificate',
    dependsOn: [RnvTaskName.appConfigure],
    fn: async ({ ctx }) => {
        for (const config of ctx.paths.appConfig.configs) {
            if (config.includes('base')) {
                const { confirm } = await inquirerPrompt({
                    message:
                        'Tizen - used certificate change. NOTE: you must create the certificate first through the tizens certificate-manager. Continue?',
                    type: 'confirm',
                    name: 'confirm',
                });
                if (!confirm) {
                    return;
                }
                const { selectedPlatforms } = await inquirerPrompt({
                    message: 'For which platform do you want to set the new certificate?',
                    type: 'checkbox',
                    name: 'selectedPlatforms',
                    choices: ctx.buildConfig.defaults?.supportedPlatforms?.filter((platform) =>
                        platform.includes('tizen')
                    ),
                    pageSize: 20,
                    validate: (val) => !!val.length || 'Please select at least a platform',
                });
                const { name } = await inquirerPrompt({
                    message: 'Enter the new certificate name:',
                    type: 'input',
                    name: 'name',
                });
                if (name === '') {
                    logInfo('No certificate name entered.');
                    return;
                }

                if (!fs.existsSync(config)) {
                    const configContent = JSON.stringify(
                        {
                            platforms: {
                                [selectedPlatforms[0]]: {
                                    certificateProfile: name,
                                },
                            },
                        },
                        null,
                        2
                    );

                    fs.writeFileSync(config, configContent);
                }

                const configFile = await JSON.parse(fs.readFileSync(config, 'utf-8'));

                selectedPlatforms.forEach((platform: string) => {
                    if (!configFile.platforms[platform]) {
                        configFile.platforms[platform] = {};
                    }

                    configFile.platforms[`${platform}`].certificateProfile = name;
                });

                fs.writeFileSync(config, JSON.stringify(configFile, null, 2));

                await checkTizenStudioCert();

                // if user inputs a certificate name that doesn't exist, it still sets the certificate name.
                // This isn't a problem if running rnv run -p tizen, because it will create the certificate, but that isn't ideal, so should be fixed.
                return;
            }
        }
    },
    task: RnvTaskName.tizenCertificate,
    isGlobalScope: true,
});
