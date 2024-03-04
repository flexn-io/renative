import {
    isPlatformSupported,
    chalk,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { listAndroidTargets } from '@rnv/sdk-android';
import { listAppleDevices } from '@rnv/sdk-apple';
import { listTizenTargets } from '@rnv/sdk-tizen';
import { listWebOSTargets } from '@rnv/sdk-webos';
import { checkAndConfigureSdks, checkSdk } from '../../common';

const taskTargetList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetList');

    await isPlatformSupported(c, true);
    await checkAndConfigureSdks(c);
    await executeTask(c, RnvTaskName.workspaceConfigure, RnvTaskName.targetList, originTask);

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
    fn: taskTargetList,
    task: RnvTaskName.targetList,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
