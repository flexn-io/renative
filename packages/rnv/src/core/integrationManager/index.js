/* eslint-disable global-require, import/no-dynamic-require */

// import { getScopedVersion } from '../systemManager/utils';
import { registerCustomTask } from '../taskManager';


export const loadIntegrations = async (c) => {
    const integrations = c.buildConfig?.integrations;

    if (integrations) {
        Object.keys(integrations).forEach((k) => {
            // const ver = getScopedVersion(c, k, integrations[k], 'integrationTemplates');
            const instance = require(k)?.default;
            if (instance) {
                instance.getTasks().forEach((task) => {
                    registerCustomTask(c, task);
                });
            }
        });
    }
};

export const registerIntegration = () => {

};
