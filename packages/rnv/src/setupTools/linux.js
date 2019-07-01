import shell from 'shelljs';

import { commandExistsSync } from '../systemTools/exec';
import { logInfo } from '../common';
import BasePlatformSetup from './base';

class LinuxPlatformSetup extends BasePlatformSetup {
    constructor(globalConfigPath) {
        super('linux', globalConfigPath);
    }

    async installSoftware(software) {
        if (commandExistsSync('apt-get')) {
            await shell.exec(`apt-get -qq update && apt-get install ${software} -y > /dev/null`);
        }
        // @todo also treat other linux flavours
        return true;
    }

    async installPrereqs() {
        if (!this.availableDownloader) {
            logInfo('Looks like you don\'t have wget or curl installed. We\'ll install wget for you');
            await this.installSoftware('wget');
        }

        if (!commandExistsSync('unzip')) {
            logInfo('Looks like you don\'t have unzip installed. We\'ll install it for you');
            await this.installSoftware('unzip');
        }

        if (!commandExistsSync('javac')) {
            logInfo('Looks like you don\'t have java installed. We\'ll install it for you');
            await this.installSoftware('openjdk-8-jdk');
        }

        return true;
    }
}

export default LinuxPlatformSetup;
