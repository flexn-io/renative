/* eslint-disable import/no-cycle */
import { executeAsync, commandExistsSync } from '../core/systemManager/exec';
import { getAppFolder } from '../core/common';
import Config from '../core/configManager/config';
import PlatformSetup from '../core/setupManager';

const rnvFastlane = async () => {
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

export { rnvFastlane };
