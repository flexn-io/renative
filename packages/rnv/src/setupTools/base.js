/* eslint-disable import/no-cycle */
import shell from 'shelljs';

import { commandExistsSync } from '../systemTools/exec';
import { logInfo, logDebug } from '../common';
import { updateConfigFile } from '../systemTools/fileutils';

class BasePlatformSetup {
    constructor(os, globalConfigPath) {
        this.os = os;
        this.globalConfigPath = globalConfigPath;
        this.availableDownloader = null;
        this.androidSdkURL = 'https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip';
        this.androidSdkDownloadLocation = '~/sdk-tools-linux-4333796.zip';
        this.androidSdkLocation = '~/Android'.replace('~', process.env.HOME);
        this.sdksToInstall = '"build-tools;28.0.3" "emulator" "extras;android;m2repository" "extras;google;m2repository" "patcher;v4" "platform-tools" "platforms;android-28" "sources;android-28" "system-images;android-28;google_apis_playstore;x86" "tools"';
    }

    checkPrereqs() {
        logInfo(`Platform ${this.os}`);
        logInfo('Checking if wget or curl is installed');
        if (commandExistsSync('wget')) {
            this.availableDownloader = 'wget';
        } else if (commandExistsSync('curl')) {
            this.availableDownloader = 'curl';
        }
    }

    async installPrereqs() {
        // to be overwritten
        return true;
    }

    async downloadAndroidSdk() {
        const downloader = this.availableDownloader;
        if (!downloader) throw new Error('Wget or cURL not installed!');
        // remove the file if existing first
        await shell.exec(`rm ${this.androidSdkDownloadLocation}`);

        let aditionalArguments;
        let locationArgument;
        if (downloader === 'wget') {
            aditionalArguments = '-q';
            locationArgument = '-P ~/';
        }
        if (downloader === 'curl') {
            aditionalArguments = '-#';
            locationArgument = `--output ${this.androidSdkDownloadLocation}`;
        }

        const command = `${downloader} ${aditionalArguments} ${this.androidSdkURL} ${locationArgument}`;

        logDebug('BasePlatformSetup -> downloadAndroidSdk -> command', command);
        logInfo('Downloading Android SDK...');
        await shell.exec(command);
    }

    async unzipAndroidSdk() {
        if (!commandExistsSync('unzip')) throw new Error('unzip is not installed');
        await shell.exec(`unzip -qq -o ${this.androidSdkDownloadLocation} -d ${this.androidSdkLocation}`);
    }

    async installSdksAndEmulator() {
        logDebug('BasePlatformSetup -> installSdksAndEmulator -> accepting licenses');
        await shell.exec(`yes | ${this.androidSdkLocation}/tools/bin/sdkmanager --licenses > /dev/null`);
        logDebug('BasePlatformSetup -> installSdksAndEmulator -> installing sdk', this.sdksToInstall);
        await shell.exec(`${this.androidSdkLocation}/tools/bin/sdkmanager ${this.sdksToInstall}`);
    }

    async installAndroidSdk() {
        this.checkPrereqs();
        await this.installPrereqs();
        await this.downloadAndroidSdk();
        await this.unzipAndroidSdk();
        await this.installSdksAndEmulator();
        await updateConfigFile({ androidSdk: this.androidSdkLocation }, this.globalConfigPath);
        return this.androidSdkLocation;
    }
}

export default BasePlatformSetup;
