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
        console.log('!exist');
        const setupInstance = PlatformSetup();
        await setupInstance.askToInstallSDK('fastlane');
    }

    const c = Config.getConfig();

    // shell: true,
    // stdio: 'inherit',
    // silent: true,

    const appFolder = getAppFolder(c, c.platform);

    return executeAsync(c, `fastlane ${args.join(' ')}`, {
        interactive: true,
        env: process.env,
        cwd: appFolder
    });
};

export { rnvFastlane };
