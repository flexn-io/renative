import lGet from 'lodash/get';
import {
    chalk,
    logTask,
    logToSummary,
    PARAMS,
    executeTask,
    configureRuntimeDefaults,
    readObjectSync,
    fsExistsSync,
    RnvTaskFn,
    validateRenativeProjectSchema,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const configTargets = [
    'workspace.config',
    'workspace.project.config',
    'workspace.appConfig.configs',
    'project.config',
    'appConfig.configs',
];

export const taskRnvDoctor: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDoctor');

    await configureRuntimeDefaults(c);
    await executeTask(c, TaskKey.appConfigure, parentTask, originTask);
    await configureRuntimeDefaults(c);

    const configPaths: Array<string> = [];

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
            const result = validateRenativeProjectSchema(cObj);
            if (!result.success) {
                hasErrors = true;
                errMsg += chalk().yellow(`\nInvalid schema in ${cPath}. ISSUES:\n\n`);
                result.error.errors?.forEach((err) => {
                    errMsg += chalk().yellow(`${chalk().grey(err.path)}: ${err.message}`);
                });
            }
            // if (!valid) {
            //     hasErrors = true;
            //     // console.log('ERROR', ajv.errors);
            //     errMsg += chalk().yellow(
            //         `\nInvalid schema in ${
            //             // cPath}. ISSUES: ${JSON.stringify(ajv.errors, null, 2)}\n`);
            //             cPath
            //         }. ISSUES:\n\n`
            //     );
            //     if (typeof ajv !== 'boolean' && ajv) {
            //         ajv.errors?.forEach((err) => {
            //             errMsg += chalk().yellow(
            //                 `${chalk().grey(err.dataPath === '' ? '/' : err.dataPath)}: ${err.message} ${Object.keys(
            //                     err.params
            //                 )
            //                     .map((k) => `=> ${chalk().red(err.params[k])}`)
            //                     .join('\n')}\n`
            //             );
            //         });
            //     }
            // }
        }
    });

    if (!hasErrors) {
        errMsg += chalk().green(`PASSED ${configPaths.length} files`);
    }

    logToSummary(errMsg);
};

const Task: RnvTask = {
    description: 'Checks validity and config health of your project',
    fn: taskRnvDoctor,
    task: TaskKey.doctor,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
