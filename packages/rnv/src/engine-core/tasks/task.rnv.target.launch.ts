import { isPlatformSupported } from '../../core/platformManager';
import { chalk, logTask } from '../../core/systemManager/logger';
import {
    IOS,
    ANDROID,
    TVOS,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    KAIOS,
    TASK_WORKSPACE_CONFIGURE,
    TASK_TARGET_LAUNCH,
    PARAMS,
} from '../../core/constants';
import { checkSdk } from '../../core/sdkManager/installer';

import { launchTizenSimulator } from '../../core/sdkManager/deviceUtils/tizen';
import { launchWebOSimulator } from '../../core/sdkManager/deviceUtils/webos';
import { launchAndroidSimulator } from '../../core/sdkManager/deviceUtils/android';
import { launchAppleSimulator } from '../../core/sdkManager/deviceUtils/apple';
import { launchKaiOSSimulator } from '../../core/sdkManager/deviceUtils/kaios';
import { executeTask } from '../../core/taskManager';
import { RnvTaskFn } from '../../core/taskManager/types';

export const taskRnvTargetLaunch: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvTargetLaunch');

    await isPlatformSupported(c, true);
    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_TARGET_LAUNCH, originTask);

    const { platform, program } = c;
    const target = program.target || c.files.workspace.config.defaultTargets[platform];

    await checkSdk(c);

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            return launchAndroidSimulator(c, target);
        case IOS:
        case TVOS:
            return launchAppleSimulator(c, target);
        case TIZEN:
            return launchTizenSimulator(c, target);
        case WEBOS:
            return launchWebOSimulator(c);
        case KAIOS:
            return launchKaiOSSimulator(c);
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
    isGlobalScope: true,
};
