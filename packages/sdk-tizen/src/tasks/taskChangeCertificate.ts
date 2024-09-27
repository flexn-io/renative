import { createTask, inquirerPrompt, logInfo, RnvTaskName } from '@rnv/core';
import fs from 'fs';
import { checkTizenStudioCert } from '../runner';

export default createTask({
    description: 'Change tizen certificate',
    fn: async ({ ctx }) => {
        for (const config of ctx.paths.appConfig.configs) {
            if (config.includes('base')) {
                const configFile = await JSON.parse(fs.readFileSync(config, 'utf-8'));
                const { confirm } = await inquirerPrompt({
                    message:
                        'Tizen - used certificate change. NOTE: you must create the certificate first through the tizens certificate-manager. Continue?',
                    type: 'confirm',
                    name: 'confirm',
                });
                if (!confirm) {
                    return;
                }
                const { platform } = await inquirerPrompt({
                    message: 'For which platform do you want to set the new certificate?',
                    type: 'list',
                    name: 'platform',
                    choices: ['tizen', 'tizenwatch', 'tizenmobile'],
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

                configFile.platforms[`${platform}`].certificateProfile = name;

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
