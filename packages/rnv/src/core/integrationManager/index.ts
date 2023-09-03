import path from 'path';
import { RnvContext } from '../configManager/types';
import { fsExistsSync } from '../systemManager/fileutils';
// import { getScopedVersion } from '../systemManager/utils';
import { logTask, logWarning } from '../systemManager/logger';
import { registerCustomTask } from '../taskManager';

export const loadIntegrations = async (c: RnvContext) => {
    logTask('loadIntegrations');
    const integrations = c.buildConfig?.integrations;

    if (integrations) {
        Object.keys(integrations).forEach((integration) => {
            // const ver = getScopedVersion(c, k, integrations[k], 'integrationTemplates');

            // Local node modules take precedence
            let intPath = path.join(c.paths.project.nodeModulesDir, integration);
            if (!fsExistsSync(intPath)) {
                intPath = integration;
            }
            try {
                const instance = require(intPath)?.default;
                if (instance) {
                    instance.getTasks().forEach((task: any) => {
                        registerCustomTask(c, task);
                    });
                }
            } catch (err) {
                logWarning(
                    `You have integration ${integration} defined, but it wasn't found in package.json. ERR: ${err}`
                );
            }
        });
    }
};

export const registerIntegration = () => {
    //Do nothing
};
