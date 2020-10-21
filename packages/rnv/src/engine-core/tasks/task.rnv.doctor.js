import lGet from 'lodash.get';
import { chalk, logTask, logToSummary } from '../../core/systemManager/logger';
import { PARAMS, TASK_DOCTOR, TASK_APP_CONFIGURE } from '../../core/constants';
import { executeTask } from '../../core/engineManager';
import { configureRuntimeDefaults } from '../../core/configManager/configParser';
import { readObjectSync, fsExistsSync } from '../../core/systemManager/fileutils';
import {
    validateRenativeJsonSchema,
    // validateRuntimeObjectSchema
} from '../../core/schemaManager/schemaParser';

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
    let hasErrors = false;
    configPaths.forEach((cPath) => {
        if (fsExistsSync(cPath)) {
            const cObj = readObjectSync(cPath);

            const [valid, ajv] = validateRenativeJsonSchema(cObj);
            if (!valid) {
                hasErrors = true;
                // console.log('ERROR', ajv.errors);
                errMsg += chalk().yellow(`\nInvalid schema in ${
                    // cPath}. ISSUES: ${JSON.stringify(ajv.errors, null, 2)}\n`);
                    cPath}. ISSUES:\n\n`);
                ajv.errors.forEach((err) => {
                    errMsg += chalk().yellow(`${
                        chalk().grey(err.dataPath === '' ? '/' : err.dataPath)}: ${err.message} ${
                        Object.keys(err.params).map(k => `=> ${chalk().red(err.params[k])}`).join('\n')}\n`);
                });
            }
        }
    });

    if (!hasErrors) {
        errMsg += chalk().green(`PASSED ${configPaths.length} files`);
    }

    // const [valid, ajv] = validateRuntimeObjectSchema(c);
    // if (!valid) {
    //     console.log('ERROR', ajv.errors);
    // }

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
