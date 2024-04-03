import {
    RnvPlatformKey,
    RnvContext,
    createTask,
    RnvTaskName,
    chalk,
    configureRuntimeDefaults,
    executeTask,
    inquirerPrompt,
    logSuccess,
} from '@rnv/core';
import { checkPortInUse } from '@rnv/sdk-utils';
import killPort from 'kill-port';

export default createTask({
    description: 'Kills all the processes related to this project',
    fn: async ({ ctx, taskName, originTaskName }) => {
        const usedPorts: RnvContext['runtime']['supportedPlatforms'] = [];
        let platArray: RnvContext['runtime']['supportedPlatforms'] = [];
        const results = [];
        let ports: Partial<Record<RnvPlatformKey, number>> = {};

        await configureRuntimeDefaults();

        if (ctx.paths.project.configExists) {
            await executeTask({ taskName: RnvTaskName.appConfigure, parentTaskName: taskName, originTaskName });
            await configureRuntimeDefaults();
            platArray = Object.values(ctx.runtime.supportedPlatforms);
            ports = ctx.buildConfig?.defaults?.ports || {};
        }
        for (let i = 0; i < platArray.length; i++) {
            const plat = platArray[i];
            const port = ports?.[plat.platform];
            plat.port = port;
            if (port) {
                results.push(checkPortInUse(port));
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
${usedPorts.map((v) => chalk().bold(`> ${v.port} (${v.platform})`)).join('\n')}`,
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
    },
    task: RnvTaskName.kill,
    isGlobalScope: true,
});
