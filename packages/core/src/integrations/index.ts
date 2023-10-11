import path from 'path';
import { RnvContext } from '../context/types';
import { fsExistsSync } from '../system/fs';
import { logTask, logWarning } from '../logger';
import { registerCustomTask } from '../tasks';

export const loadIntegrations = async (c: RnvContext) => {
    logTask('loadIntegrations');
    const integrations = c.buildConfig?.integrations;

    if (integrations) {
        Object.keys(integrations).forEach((integration) => {
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
