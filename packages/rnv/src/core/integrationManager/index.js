/* eslint-disable global-require, import/no-dynamic-require */

// import { getScopedVersion } from '../systemManager/utils';
import { logTask, logWarning } from '../systemManager/logger';
import { registerCustomTask } from '../taskManager';

export const loadIntegrations = async (c) => {
    logTask('loadIntegrations');
    const integrations = c.buildConfig?.integrations;

    if (integrations) {
        Object.keys(integrations).forEach((integration) => {
            // const ver = getScopedVersion(c, k, integrations[k], 'integrationTemplates');
            try {
                const instance = require(integration)?.default;
                if (instance) {
                    instance.getTasks().forEach((task) => {
                        registerCustomTask(c, task);
                    });
                }
            } catch (err) {
                logWarning(`You have integration ${integration} defined, but it wasn't found in package.json`);
            }
        });
    }
};

export const registerIntegration = () => {

};
