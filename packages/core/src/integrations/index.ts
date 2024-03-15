import path from 'path';
import { fsExistsSync } from '../system/fs';
import { logDefault, logWarning } from '../logger';
import { registerCustomTask } from '../tasks';
import { RnvIntegration } from './types';
import { getContext } from '../context/provider';

export const loadIntegrations = async () => {
    logDefault('loadIntegrations');
    const c = getContext();

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
                        registerCustomTask(task);
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
