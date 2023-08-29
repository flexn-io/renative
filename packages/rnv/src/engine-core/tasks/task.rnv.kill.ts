import killPort from 'kill-port';
import { inquirerPrompt } from '../../cli/prompt';
import { checkPortInUse } from '../../core/common';
import { executeTask } from '../../core/taskManager';
import { chalk, logTask, logSuccess } from '../../core/systemManager/logger';
import { configureRuntimeDefaults } from '../../core/runtimeManager';

import { PARAMS, TASK_KILL, TASK_APP_CONFIGURE } from '../../core/constants';

export const taskRnvKill = async (c, parentTask, originTask) => {
    logTask('taskRnvKill');

    const usedPorts = [];
    let platArray = [];
    const results = [];
    let ports;

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
        results.push(checkPortInUse(c, plat.platform, port));
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
                killPromise.push(killPort(v.port));
            });
            await Promise.all(usedPorts);
            logSuccess('Processes KILLED');
        }
    }
    return true;
};

export default {
    description: 'Kills all the processes related to this project',
    fn: taskRnvKill,
    task: TASK_KILL,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};
