import { executeAsync, commandExistsSync } from '../core/systemManager/exec';
import { getAppFolder } from '../core/common';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
} from '../core/constants';
import Config from '../core/configManager/config';
import PlatformSetup from '../core/setupManager';

export const taskRnvFastlane = async () => {
    const args = Config.rnvArguments;
    args.shift(); // we know the first one is fastlane, trash it

    if (!commandExistsSync('fastlane')) {
        const setupInstance = PlatformSetup();
        await setupInstance.askToInstallSDK('fastlane');
    }

    const c = Config.getConfig();
    const appFolder = getAppFolder(c, c.platform);

    let fastlaneArgs = [...c.program.rawArgs];
    fastlaneArgs = fastlaneArgs.slice(3);

    return executeAsync(c, `fastlane ${fastlaneArgs.join(' ')}`, {
        interactive: true,
        env: process.env,
        cwd: appFolder
    });
};

export default {
    description: 'Run fstalane commands directly',
    fn: taskRnvFastlane,
    task: 'fastlane',
    params: [],
    platforms: [
        IOS,
        TVOS,
        ANDROID,
        ANDROID_TV,
        ANDROID_WEAR,
    ],
};
