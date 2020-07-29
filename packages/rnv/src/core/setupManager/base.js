import shell from 'shelljs';
import inquirer from 'inquirer';

import { commandExistsSync } from '../systemManager/exec';
import { TASK_WORKSPACE_CONFIGURE } from '../constants';
import { executeTask } from '../engineManager';
import { replaceHomeFolder, updateConfigFile } from '../systemManager/fileutils';
import setupConfig from './config';
import Config from '../configManager/config';
import { logTask, logError, logInfo, logDebug, logSuccess } from '../systemManager/logger';

class BasePlatformSetup {
    constructor(os, c) {
        // eslint-disable-next-line no-param-reassign
        if (!c) c = Config.getConfig();
        const { paths } = c;
        this.os = os;
        this.c = c;
        this.globalConfigPath = paths.workspace.config;
        this.availableDownloader = null;
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

    async postInstall(sdk) {
        if (sdk === 'android') {
            const { location } = setupConfig.android;
            await updateConfigFile(
                { androidSdk: location },
                this.globalConfigPath
            );
            await executeTask(this.c, TASK_WORKSPACE_CONFIGURE); // trigger the configure to update the paths for clis
        }

        if (sdk === 'tizen') {
            await updateConfigFile(
                { tizenSdk: this.tizenSdkPath },
                this.globalConfigPath
            );
            await executeTask(this.c, TASK_WORKSPACE_CONFIGURE); // trigger the configure to update the paths for clis
        }

        if (sdk === 'webos') {
            await updateConfigFile(
                { webosSdk: this.webosSdkPath },
                this.globalConfigPath
            );
            await executeTask(this.c, TASK_WORKSPACE_CONFIGURE); // trigger the configure to update the paths for clis
        }
    }

    async downloadSdk(sdk) {
        const downloader = this.availableDownloader;
        if (!downloader) throw new Error('Wget or cURL not installed!');
        logDebug(
            `Downloading ${sdk} SDK to ${setupConfig[sdk].downloadLocation} using ${downloader}`
        );
        // remove the file if existing first
        await shell.rm(setupConfig[sdk].downloadLocation);

        let aditionalArguments;
        let locationArgument;
        if (downloader === 'wget') {
            aditionalArguments = '-q';
            locationArgument = replaceHomeFolder('-P ~/');
        }
        if (downloader === 'curl') {
            aditionalArguments = '-#';
            locationArgument = `--output ${setupConfig[sdk].downloadLocation}`;
        }

        const command = `${downloader} ${aditionalArguments} ${setupConfig[sdk].sdkUrl} ${locationArgument}`;

        logDebug('Running', command);
        logInfo(`Downloading ${sdk} SDK...`);
        await shell.exec(command);
    }

    async unzipSdk(sdk) {
        logDebug(
            `Unzipping from ${setupConfig[sdk].downloadLocation} to ${setupConfig[sdk].location}`
        );
        if (!commandExistsSync('unzip')) { throw new Error('unzip is not installed'); }
        await shell.exec(
            `unzip -qq -o ${setupConfig[sdk].downloadLocation} -d ${setupConfig[sdk].location}`
        );
    }

    async installSdksAndEmulator() {
        logTask('installSdksAndEmulator');
        logDebug('Accepting licenses');
        await shell.exec(
            `yes | ${setupConfig.android.location}/tools/bin/sdkmanager --licenses > /dev/null`
        );
        logDebug('Installing SDKs', this.sdksToInstall);
        await shell.exec(
            `${setupConfig.android.location}/tools/bin/sdkmanager ${this.sdksToInstall} > /dev/null`
        );
        logSuccess(`SDK succefully installed at: ${setupConfig.android.location}`);
    }

    async installSdk(sdk, skipPrereq) {
        logTask(`installSdk:${sdk}`);
        !skipPrereq && this.checkPrereqs();
        !skipPrereq && (await this.installPrereqs());

        switch (sdk) {
            case 'android':
                await this.downloadSdk(sdk);
                await this.unzipSdk(sdk);
                await this.installSdksAndEmulator();
                break;
            case 'tizen':
                await this.installTizenSdk();
                break;
            case 'webos':
                await this.installWebosSdk();
                break;
            case 'fastlane':
                await this.installFastlane();
                break;
            case 'docker':
                await this.installDocker();
                break;
            case 'aws':
                await this.installAws();
                break;
            default:
                break;
        }

        this.postInstall(sdk);
    }

    async installTizenSdk() {
        // to be overwritten
        logError(
            'Install webos sdk not supported yet. Follow https://developer.tizen.org/development/tizen-studio/download to install it manually'
        );
        return true;
    }

    async installWebosSdk() {
        // to be overwritten
        logError(
            'Install webos sdk not supported yet. Follow http://webostv.developer.lge.com/sdk/installation/ to install it manually'
        );
        return true;
    }

    async installFastlane() {
        // to be overwritten
        logError(
            'Install fastlane not supported yet. Follow https://docs.fastlane.tools/getting-started/ios/setup/ to install it manually'
        );
        return true;
    }

    async installDocker() {
        // to be overwritten
        logError('Install docker not supported yet');
        return true;
    }

    async installAws() {
        // to be overwritten
        logError('Install aws not supported yet. Follow https://docs.aws.amazon.com/cli/latest/userguide/install-macos.html to install it manually (version 1 required)');
        return true;
    }

    async askToInstallSDK(sdk) {
        let sdkInstall;
        if (!this.c.program.ci) {
            const response = await inquirer.prompt([
                {
                    name: 'sdkInstall',
                    type: 'confirm',
                    message: `Do you want to install ${sdk} SDK?`
                }
            ]);
            // eslint-disable-next-line prefer-destructuring
            sdkInstall = response.sdkInstall;
        }

        if (this.c.program.ci || sdkInstall) {
            await this.installSdk(sdk, ['fastlane', 'docker'].includes(sdk)); // no prereqs needed for fastlane
        } else {
            throw new Error(
                `You can't run the project on this platform without ${sdk} sdk installed`
            );
        }
    }
}

export default BasePlatformSetup;
