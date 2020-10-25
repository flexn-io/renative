import { PlatformManager, Logger, SDKManager, Constants, TaskManager } from 'rnv';

import { listTizenTargets } from '../sdks/sdk-tizen';
import { listWebOSTargets } from '../sdks/sdk-webos';

const { isPlatformSupported } = PlatformManager;
const { chalk, logTask } = Logger;
const { checkSdk } = SDKManager;
const {
    TIZEN,
    WEBOS,
    TASK_WORKSPACE_CONFIGURE, TASK_TARGET_LAUNCH,
    PARAMS
} = Constants;
const { executeTask } = TaskManager;


export const taskRnvTargetList = async (c, parentTask, originTask) => {
    logTask('taskRnvTargetList');

    await isPlatformSupported(c);
    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_TARGET_LAUNCH, originTask);

    const { platform } = c;

    await checkSdk(c);

    switch (platform) {
        case TIZEN:
            return listTizenTargets(c, platform);
        case WEBOS:
            return listWebOSTargets(c);
        default:
            return Promise.reject(
                `"target list" command does not support ${chalk().white.bold(
                    platform
                )} platform yet. Working on it!`
            );
    }
};

export default {
    description: 'List all available devices / emulators for specific platform',
    fn: taskRnvTargetList,
    task: 'target list',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true
};
