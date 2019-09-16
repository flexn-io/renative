import { executeAsync } from '../systemTools/exec';
import { commandExistsSync } from '../systemTools/exec';
import { inquirerPrompt } from '../systemTools/prompt';
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

    return executeAsync(c, `fastlane ${args.join(' ')}`, { interactive: true });
};

export { rnvFastlane };
