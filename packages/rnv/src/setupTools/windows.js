import shell from 'shelljs';
import { getInstalledPathSync } from 'get-installed-path';

import { commandExistsSync, executeAsync } from '../systemTools/exec';
import { logInfo, logDebug } from '../common';
import BasePlatformSetup from './base';

class LinuxPlatformSetup extends BasePlatformSetup {
    constructor(globalConfigPath) {
        super('win32', globalConfigPath);
        this.scoopInstalled = false;
    }

    checkPrereqs() {
        logInfo(`Platform ${this.os}`);
        logInfo('Checking wget is installed');
        if (commandExistsSync('wget')) {
            this.availableDownloader = 'wget';
        }

        // check if scoop is installed
        if (commandExistsSync('scoop')) {
            this.scoopInstalled = true;
        }
    }

    async installSoftware(software) {
        await shell.exec(`%USERPROFILE%/scoop/shims/scoop install ${software}`);
        await this.reloadPathEnv();
        return true;
    }

    addScoopBucket(bucket) {
        return shell.exec(`%USERPROFILE%/scoop/shims/scoop bucket add ${bucket}`);
    }

    async reloadPathEnv() {
        await shell.exec(`${getInstalledPathSync('rnv')}/scripts/resetPath.vbs`);
        await shell.exec('%TEMP%/resetvars.bat')
        return true;
    }

    async installPrereqs() {
        if (!this.scoopInstalled) {
            logInfo('Installing Scoop...')
            await shell.exec(`powershell -executionpolicy remotesigned "& ""${getInstalledPathSync('rnv')}/scripts/installPackageManager.ps1"""`);
            await this.reloadPathEnv();
        }
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
            await this.installSoftware('shellcheck');
            await this.addScoopBucket('java');
            await this.installSoftware('ojdkbuild8');
        }

        return true;
    }

    async installSdksAndEmulator() {
        logDebug('Accepting licenses');
        await executeAsync(`${this.androidSdkLocation}/tools/bin/sdkmanager.bat`,  ['--licenses']); // different because interactive
        logDebug('Installing SDKs', this.sdksToInstall);
        await shell.exec(`${this.androidSdkLocation}/tools/bin/sdkmanager.bat ${this.sdksToInstall}`);
    }
}

export default LinuxPlatformSetup;
