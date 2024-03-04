import path from 'path';
import { RnvContext } from '../context/types';
import { fsExistsSync } from '../system/fs';
import { logDefault, logWarning } from '../logger';
import { registerCustomTask } from '../tasks';
import { RnvIntegration } from './types';

export const loadIntegrations = async (c: RnvContext) => {
    logDefault('loadIntegrations');
    const integrations = c.buildConfig?.integrations;

    if (integrations) {
        Object.keys(integrations).forEach((integration) => {
            // Local node modules take precedence
            let intPath = path.join(c.paths.project.nodeModulesDir, integration);
            if (!fsExistsSync(intPath)) {
                intPath = integration;
            }
            try {
                const instance: RnvIntegration = require(intPath)?.default;
                if (instance) {
                    instance.getTasks().forEach((task) => {
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
