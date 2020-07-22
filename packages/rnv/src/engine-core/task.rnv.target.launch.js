import { isPlatformSupported } from '../core/platformManager';
import { chalk, logTask } from '../core/systemManager/logger';
import {
    IOS,
    ANDROID,
    TVOS,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    ANDROID_WEAR,
    KAIOS
} from '../core/constants';
import { launchTizenSimulator } from '../sdk-tizen';
import { launchWebOSimulator } from '../sdk-webos';
import {
    launchAndroidSimulator
} from '../sdk-android/deviceManager';
import { launchAppleSimulator } from '../sdk-xcode/deviceManager';
import { launchKaiOSSimulator } from '../sdk-firefox';


export const taskRnvTargetLaunch = async (c, parentTask, originTask) => {
    logTask('taskRnvTargetLaunch', `parent:${parentTask} origin:${originTask}`);

    await isPlatformSupported(c);

    const { platform, program } = c;
    const target = program.target || c.files.workspace.config.defaultTargets[platform];

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return launchAndroidSimulator(c, platform, target);
        case IOS:
        case TVOS:
            return launchAppleSimulator(c, platform, target);
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
    description: '',
    fn: taskRnvTargetLaunch,
    task: 'target launch',
    params: [],
    platforms: [],
};
