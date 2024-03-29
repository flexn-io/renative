import {
    PARAMS,
    PlatformKey,
    RnvContext,
    RnvTask,
    RnvTaskFn,
    TASK_APP_CONFIGURE,
    TASK_KILL,
    chalk,
    checkPortInUse,
    configureRuntimeDefaults,
    executeTask,
    inquirerPrompt,
    logSuccess,
    logTask,
} from '@rnv/core';
import killPort from 'kill-port';

export const taskRnvKill: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvKill');

    const usedPorts: RnvContext['runtime']['supportedPlatforms'] = [];
    let platArray: RnvContext['runtime']['supportedPlatforms'] = [];
    const results = [];
    let ports: Partial<Record<PlatformKey, number>> = {};

    await configureRuntimeDefaults(c);

    if (c.paths.project.configExists) {
        await executeTask(c, TASK_APP_CONFIGURE, TASK_KILL, originTask);
        await configureRuntimeDefaults(c);
        platArray = Object.values(c.runtime.supportedPlatforms);
        ports = c.buildConfig?.defaults?.ports || {};
    }
    for (let i = 0; i < platArray.length; i++) {
        const plat = platArray[i];
        const port = ports?.[plat.platform];
        plat.port = port;
        if (port) {
            results.push(checkPortInUse(c, plat.platform, port));
        }
    }
    const usedPortsArr = await Promise.all(results);
    usedPortsArr.forEach((isInUse, i) => {
        if (isInUse) {
            usedPorts.push(platArray[i]);
        }
    });

    if (usedPorts.length) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: 'Processes attached to the ports will be killed. Continue?',
            warningMessage: `Found active ports:
${usedPorts.map((v) => chalk().white(`> ${v.port} (${v.platform})`)).join('\n')}`,
        });
        if (confirm) {
            const killPromise = [];
            usedPorts.forEach((v) => {
                if (v.port) killPromise.push(killPort(v.port));
            });
            await Promise.all(usedPorts);
            logSuccess('Processes KILLED');
        }
    }
    return true;
};

const Task: RnvTask = {
    description: 'Kills all the processes related to this project',
    fn: taskRnvKill,
    task: TASK_KILL,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
