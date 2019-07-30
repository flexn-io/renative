import shell from 'shelljs';
import path from 'path';

import { commandExistsSync } from '../systemTools/exec';
import { logInfo } from '../common';
import BasePlatformSetup from './base';
import {
    CLI_ANDROID_ADB,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_SDKMANAGER
} from '../constants';

class LinuxPlatformSetup extends BasePlatformSetup {
    constructor(c) {
        super('linux', c);
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
            this.availableDownloader = 'wget';
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

    async postInstall({ android }) {
        if (android) {
            // @todo find a more elegant way to update this
            this.c.files.globalConfig.sdks.ANDROID_SDK = android;
            const { sdks: { ANDROID_SDK } } = this.c.files.globalConfig;
            this.c.cli[CLI_ANDROID_EMULATOR] = path.join(ANDROID_SDK, 'emulator/emulator');
            this.c.cli[CLI_ANDROID_ADB] = path.join(ANDROID_SDK, 'platform-tools/adb');
            this.c.cli[CLI_ANDROID_AVDMANAGER] = path.join(ANDROID_SDK, 'tools/bin/avdmanager');
            this.c.cli[CLI_ANDROID_SDKMANAGER] = path.join(ANDROID_SDK, 'tools/bin/sdkmanager');
        }
    }
}

export default LinuxPlatformSetup;
