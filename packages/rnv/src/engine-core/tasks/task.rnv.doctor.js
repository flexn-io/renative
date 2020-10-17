import lGet from 'lodash.get';
import Ajv from 'ajv';
import { chalk, logTask, logToSummary } from '../../core/systemManager/logger';
import { PARAMS, TASK_DOCTOR, TASK_APP_CONFIGURE } from '../../core/constants';
import { executeTask } from '../../core/engineManager';
import { configureRuntimeDefaults } from '../../core/configManager/configParser';
import { readObjectSync, fsExistsSync } from '../../core/systemManager/fileutils';

import { SCHEMAS, schemaRoot } from '../../core/configManager/configSchema';

const ajv = new Ajv({ schemas: SCHEMAS, allErrors: true });


const configTargets = [
    'workspace.config',
    'workspace.project.config',
    'workspace.appConfig.configs',
    'project.config',
    'appConfig.configs'
];

export const taskRnvDoctor = async (c, parentTask, originTask) => {
    logTask('taskRnvDoctor');


    await configureRuntimeDefaults(c);
    await executeTask(c, TASK_APP_CONFIGURE, parentTask, originTask);
    await configureRuntimeDefaults(c);

    const configPaths = [];

    configTargets.forEach((target) => {
        const tPath = lGet(c.paths, target);

        if (tPath) {
            if (Array.isArray(tPath)) {
                configPaths.push(...tPath);
            } else {
                configPaths.push(tPath);
            }
        }
    });

    let errMsg = 'RENATIVE JSON SCHEMA VALIDITY CHECK:\n\n';
    configPaths.forEach((cPath) => {
        if (fsExistsSync(cPath)) {
            const cObj = readObjectSync(cPath);

            const valid = ajv.validate(schemaRoot, cObj);
            if (!valid) {
                errMsg += chalk().yellow(`Invalid schema in ${
                    cPath}. ISSUES: ${JSON.stringify(ajv.errors, null, 2)}\n`);
            // ajv.errors.forEach((err, i) => {
            //   errMsg += `{err.}`
            // });
            }
        }
    });

    logToSummary(errMsg);
};

export default {
    description: 'Checks validity and config health of your project',
    fn: taskRnvDoctor,
    task: TASK_DOCTOR,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true
};
