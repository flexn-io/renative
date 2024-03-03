import { isPlatformSupported, chalk, logTask, PARAMS, executeTask, RnvTaskFn, RnvTask, TaskKey } from '@rnv/core';
import { listAndroidTargets } from '@rnv/sdk-android';
import { listAppleDevices } from '@rnv/sdk-apple';
import { listTizenTargets } from '@rnv/sdk-tizen';
import { listWebOSTargets } from '@rnv/sdk-webos';
import { checkAndConfigureSdks, checkSdk } from '../../common';

const taskRnvTargetList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvTargetList');

    await isPlatformSupported(c, true);
    await checkAndConfigureSdks(c);
    await executeTask(c, TaskKey.workspaceConfigure, TaskKey.targetList, originTask);

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
    task: TaskKey.targetList,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
