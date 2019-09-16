import path from 'path';

import { commandExistsSync, executeAsync } from '../systemTools/exec';
import { logInfo, logDebug } from '../common';
import BasePlatformSetup from './base';
import setupConfig from './config';
import Config from '../config';

class LinuxPlatformSetup extends BasePlatformSetup {
    constructor() {
        super('darwin');
    }

    async installFastlane() {
        const c = Config.getConfig();
        if (commandExistsSync('brew')) {
            return executeAsync(c, 'brew cask install fastlane', { interactive: true });
        }
        return executeAsync(c, 'sudo gem install fastlane -NV', { interactive: true });
    }
}

export default LinuxPlatformSetup;
