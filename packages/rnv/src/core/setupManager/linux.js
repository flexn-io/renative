import shell from 'shelljs';
import path from 'path';

import { commandExistsSync } from '../systemManager/exec';
import { logInfo, logDebug } from '../systemManager/logger';
import BasePlatformSetup from './base';
import { updateConfigFile, getRealPath } from '../systemManager/fileutils';
import setupConfig from './config';
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
            await shell.exec(
                `apt-get -qq update && apt-get install ${software} -y > /dev/null`
            );
        }
        // @todo also treat other linux flavours
        return true;
    }

    async installPrereqs() {
        if (!this.availableDownloader) {
            logInfo(
                "You don't have wget or curl installed. We'll install wget for you"
            );
            await this.installSoftware('wget');
            this.availableDownloader = 'wget';
        }

        if (!commandExistsSync('unzip')) {
            logInfo(
                "You don't have unzip installed. We'll install it for you"
            );
            await this.installSoftware('unzip');
        }

        if (!commandExistsSync('javac')) {
            logInfo(
                "You don't have java installed. We'll install it for you"
            );
            await this.installSoftware('openjdk-8-jdk');
        }

        return true;
    }

    async postInstall(sdk) {
        if (sdk === 'android') {
            const { location } = setupConfig.android;
            logDebug(
                `Updating ${this.globalConfigPath} with ${JSON.stringify({
                    androidSdk: location
                })}`
            );
            await updateConfigFile(
                { androidSdk: location },
                this.globalConfigPath
            );
            // @todo find a more elegant way to update this
            this.c.files.workspace.config.sdks.ANDROID_SDK = location;
            const {
                sdks: { ANDROID_SDK }
            } = this.c.files.workspace.config;
            this.c.cli[CLI_ANDROID_EMULATOR] = getRealPath(
                this.c,
                path.join(ANDROID_SDK, 'emulator/emulator')
            );
            this.c.cli[CLI_ANDROID_ADB] = getRealPath(
                this.c,
                path.join(ANDROID_SDK, 'platform-tools/adb')
            );
            this.c.cli[CLI_ANDROID_AVDMANAGER] = getRealPath(
                this.c,
                path.join(ANDROID_SDK, 'tools/bin/avdmanager')
            );
            this.c.cli[CLI_ANDROID_SDKMANAGER] = getRealPath(
                this.c,
                path.join(ANDROID_SDK, 'tools/bin/sdkmanager')
            );
        }
    }
}

export default LinuxPlatformSetup;
