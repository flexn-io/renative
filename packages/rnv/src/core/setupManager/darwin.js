import { commandExistsSync, executeAsync } from '../systemManager/exec';
import BasePlatformSetup from './base';
import Config from '../configManager/config';

class LinuxPlatformSetup extends BasePlatformSetup {
    constructor() {
        super('darwin');
    }

    async installFastlane() {
        const c = Config.getConfig();
        if (commandExistsSync('brew')) {
            return executeAsync(c, 'brew cask install fastlane', {
                interactive: true
            });
        }
        return executeAsync(c, 'sudo gem install fastlane -NV', {
            interactive: true
        });
    }

    async installDocker() {
        throw new Error(
            'Automated Docker install is not supported on this platform. Please go to https://hub.docker.com/editions/community/docker-ce-desktop-mac and install it manually. Then rerun this command'
        );
    }
}

export default LinuxPlatformSetup;
