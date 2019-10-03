import { executeAsync } from '../systemTools/exec';
import { commandExistsSync } from '../systemTools/exec';
import { inquirerPrompt } from '../systemTools/prompt';
import { getAppFolder } from '../common';
import Config from '../config';
import PlatformSetup from '../setupTools';

const rnvFastlane = async () => {
    const args = Config.rnvArguments;
    args.shift(); // we know the first one is fastlane, trash it

    if (!commandExistsSync('fastlane')) {
        const setupInstance = PlatformSetup();
        await setupInstance.askToInstallSDK('fastlane');
    }

    const c = Config.getConfig();

    // shell: true,
    // stdio: 'inherit',
    // silent: true,

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
