/* eslint-disable import/no-cycle */
import shell from 'shelljs';
import inquirer from 'inquirer';

import { commandExistsSync } from '../systemTools/exec';
import { logInfo, logDebug } from '../common';
import { updateConfigFile, replaceHomeFolder } from '../systemTools/fileutils';

const isRunningOnWindows = process.platform === 'win32';

let platform = isRunningOnWindows ? 'windows' : 'linux';
if (process.platform === 'darwin') platform = 'darwin';

class BasePlatformSetup {
    constructor(os, c) {
        const { paths: { globalConfigPath } } = c;
        this.os = os;
        this.c = c;
        this.globalConfigPath = globalConfigPath;
        this.availableDownloader = null;
        this.androidSdkURL = `https://dl.google.com/android/repository/sdk-tools-${platform}-4333796.zip`;
        this.androidSdkDownloadLocation = replaceHomeFolder(`~/sdk-tools-${platform}-4333796.zip`);
        this.androidSdkLocation = replaceHomeFolder('~/Android');
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

    async postInstall() {
        // to be overwritten
        return true;
    }

    async downloadAndroidSdk() {
        const downloader = this.availableDownloader;
        if (!downloader) throw new Error('Wget or cURL not installed!');
        logDebug(`Downloading Android SDK to ${this.androidSdkDownloadLocation} using ${downloader}`);
        // remove the file if existing first
        await shell.rm(this.androidSdkDownloadLocation);

        let aditionalArguments;
        let locationArgument;
        if (downloader === 'wget') {
            aditionalArguments = '-q';
            locationArgument = replaceHomeFolder('-P ~/');
        }
        if (downloader === 'curl') {
            aditionalArguments = '-#';
            locationArgument = `--output ${this.androidSdkDownloadLocation}`;
        }

        const command = `${downloader} ${aditionalArguments} ${this.androidSdkURL} ${locationArgument}`;

        logDebug('Running', command);
        logInfo('Downloading Android SDK...');
        await shell.exec(command);
    }

    async unzipAndroidSdk() {
        logDebug(`Unzipping from ${this.androidSdkDownloadLocation} to ${this.androidSdkLocation}`);
        if (!commandExistsSync('unzip')) throw new Error('unzip is not installed');
        await shell.exec(`unzip -qq -o ${this.androidSdkDownloadLocation} -d ${this.androidSdkLocation}`);
    }

    async installSdksAndEmulator() {
        logDebug('Accepting licenses');
        await shell.exec(`yes | ${this.androidSdkLocation}/tools/bin/sdkmanager --licenses > /dev/null`);
        logDebug('Installing SDKs', this.sdksToInstall);
        await shell.exec(`${this.androidSdkLocation}/tools/bin/sdkmanager ${this.sdksToInstall} > /dev/null`);
    }

    async installAndroidSdk() {
        this.checkPrereqs();
        await this.installPrereqs();
        await this.downloadAndroidSdk();
        await this.unzipAndroidSdk();
        await this.installSdksAndEmulator();
        logDebug(`Updating ${this.globalConfigPath} with ${JSON.stringify({ androidSdk: this.androidSdkLocation })}`);
        await updateConfigFile({ androidSdk: this.androidSdkLocation }, this.globalConfigPath);
        return this.androidSdkLocation;
    }

    async installTizenSdk() {
        this.checkPrereqs();
        await this.installPrereqs();
    }

    async installWebosSdk() {
        this.checkPrereqs();
        await this.installPrereqs();
    }

    async askToInstallSDK(sdk) {
        let sdkInstall;
        if (!this.c.program.ci) {
            const response = await inquirer.prompt([{
                name: 'sdkInstall',
                type: 'confirm',
                message: `Do you want to install ${sdk} SDK?`,
            }]);
            // eslint-disable-next-line prefer-destructuring
            sdkInstall = response.sdkInstall;
        }

        if (this.c.program.ci || sdkInstall) {
            switch (sdk) {
            case 'android':
                const android = await this.installAndroidSdk();
                this.postInstall({ android });
                break;
            case 'tizen':
                const tizen = await this.installTizenSdk();
                this.postInstall({ tizen });
                break;
            case 'webos':
                const webos = await this.installWebosSdk();
                this.postInstall({ webos });
                break;
            default:
                break;
            }
        }
    }
}

export default BasePlatformSetup;
