import { PlatformManager, Logger, Constants, TaskManager } from 'rnv';
import { launchKaiOSSimulator } from '../sdks/sdk-firefox';
import { launchTizenSimulator } from '../sdks/sdk-tizen';
import { launchWebOSimulator } from '../sdks/sdk-webos';

const { executeTask } = TaskManager;
const { isPlatformSupported } = PlatformManager;
const { chalk, logTask } = Logger;
const {
    TIZEN,
    WEBOS,
    KAIOS,
    TASK_WORKSPACE_CONFIGURE,
    TASK_TARGET_LAUNCH,
    PARAMS
} = Constants;


export const taskRnvTargetLaunch = async (c, parentTask, originTask) => {
    logTask('taskRnvTargetLaunch');

    await isPlatformSupported(c);
    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_TARGET_LAUNCH, originTask);

    const { platform, program } = c;
    const target = program.target || c.files.workspace.config.defaultTargets[platform];

    switch (platform) {
        case TIZEN:
            return launchTizenSimulator(c, target);
        case WEBOS:
            return launchWebOSimulator(c, target);
        case KAIOS:
            return launchKaiOSSimulator(c, target);
        default:
            return Promise.reject(
                `"target launch" command does not support ${chalk().white.bold(
                    platform
                )} platform yet. You will have to launch the emulator manually. Working on it!`
            );
    }
};

export default {
    description: 'Launch specific emulator',
    fn: taskRnvTargetLaunch,
    task: 'target launch',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true
};
