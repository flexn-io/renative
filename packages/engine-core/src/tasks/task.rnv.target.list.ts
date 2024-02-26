import {
    isPlatformSupported,
    chalk,
    logTask,
    TASK_WORKSPACE_CONFIGURE,
    TASK_TARGET_LAUNCH,
    PARAMS,
    executeTask,
    RnvTaskFn,
    RnvTask,
    TASK_TARGET_LIST,
} from '@rnv/core';
import { listAndroidTargets } from '@rnv/sdk-android';
import { listAppleDevices } from '@rnv/sdk-apple';
import { listTizenTargets } from '@rnv/sdk-tizen';
import { listWebOSTargets } from '@rnv/sdk-webos';

import { checkAndConfigureSdks, checkSdk } from '../common';

export const taskRnvTargetList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvTargetList');

    await isPlatformSupported(c, true);
    await checkAndConfigureSdks(c);
    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_TARGET_LAUNCH, originTask);

    const { platform } = c;

    await checkSdk(c);

    switch (platform) {
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
            return listAndroidTargets(c);
        case 'ios':
        case 'tvos':
            return listAppleDevices(c);
        case 'tizen':
            return listTizenTargets(c);
        case 'webos':
            return listWebOSTargets(c);
        default:
            return Promise.reject(
                `"target list" command does not support ${chalk().white.bold(platform)} platform yet. Working on it!`
            );
    }
};

const Task: RnvTask = {
    description: 'List all available targets for specific platform',
    fn: taskRnvTargetList,
    task: TASK_TARGET_LIST,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
