import path from 'path';
import { fsExistsSync } from '../system/fs';
import { logDefault, logWarning } from '../logger';
import { getContext } from '../context/provider';
import { registerRnvTasks } from '../tasks/taskRegistry';
import { RnvModule } from './types';

export const loadRnvModulesFromProject = async () => {
    logDefault('loadRnvModulesFromProject');
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
                const instance: RnvModule = require(intPath)?.default;
                if (instance) {
                    c.runtime.modulesByIndex.push(instance);
                    registerRnvTasks(instance.tasks);
                    instance.initContextPayload();
                }
            } catch (err) {
                logWarning(
                    `You have integration ${integration} defined, but it wasn't found in package.json. ERR: ${err}`
                );
            }
        });
    }
};
