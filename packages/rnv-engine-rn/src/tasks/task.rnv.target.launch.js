import { PlatformManager, Logger, Constants, TaskManager } from 'rnv';
import { launchAppleSimulator } from '../sdks/sdk-xcode/deviceManager';
import { launchAndroidSimulator } from '../sdks/sdk-android/deviceManager';

const { executeTask } = TaskManager;
const { isPlatformSupported } = PlatformManager;
const { chalk, logTask } = Logger;
const {
    IOS,
    ANDROID,
    TVOS,
    ANDROID_TV,
    ANDROID_WEAR,
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
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return launchAndroidSimulator(c, target);
        case IOS:
        case TVOS:
            return launchAppleSimulator(c, target);
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
