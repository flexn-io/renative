import shell from 'shelljs';
import { getInstalledPathSync } from 'get-installed-path';
import path from 'path';
import { exec } from 'child_process';
import inquirer from 'inquirer';

import {
    commandExistsSync,
    executeAsync,
    openCommand
} from '../systemManager/exec';
import { logInfo, logDebug } from '../systemManager/logger';
import { replaceHomeFolder, fsExistsSync } from '../systemManager/fileutils';
import BasePlatformSetup from './base';
import setupConfig from './config';

class LinuxPlatformSetup extends BasePlatformSetup {
    constructor(c) {
        super('win32', c);
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
        await shell.exec(
            replaceHomeFolder(`~/scoop/shims/scoop install ${software}`)
        );
        await this.reloadPathEnv();
        return true;
    }

    addScoopBucket(bucket) {
        return shell.exec(
            replaceHomeFolder(`~/scoop/shims/scoop bucket add ${bucket}`)
        );
    }

    async reloadPathEnv() {
        await shell.exec(
            `${getInstalledPathSync('rnv')}/scripts/resetPath.vbs`
        );
        await shell.exec('%TEMP%/resetvars.bat');
        return true;
    }

    async installPrereqs() {
        if (!this.scoopInstalled) {
            logInfo('Installing Scoop...');
            await shell.exec(
                `powershell -executionpolicy remotesigned "& ""${getInstalledPathSync(
                    'rnv'
                )}/scripts/installPackageManager.ps1"""`
            );
            await this.reloadPathEnv();
        }
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
            await this.installSoftware('shellcheck');
            await this.addScoopBucket('java');
            await this.installSoftware('ojdkbuild8');
        }

        return true;
    }

    async installSdksAndEmulator() {
        logDebug('Accepting licenses');
        await executeAsync(
            {},
            `${this.androidSdkLocation}/tools/bin/sdkmanager.bat --licenses`
        );
        logDebug('Installing SDKs', this.sdksToInstall);
        await executeAsync(
            {},
            `${this.androidSdkLocation}/tools/bin/sdkmanager.bat ${this.sdksToInstall}`
        );
    }

    async installTizenSdk() {
        let downloadDir = setupConfig.tizen.downloadLocation.split('/');
        downloadDir.pop();
        downloadDir = downloadDir.join('/');
        logInfo(
            `Opening ${downloadDir}. Please install the SDK then continue after it finished installing.`
        );
        exec(`start "" "${downloadDir}"`);

        const res = await inquirer.prompt({
            type: 'input',
            name: 'sdkPath',
            message:
                "Where did you install the SDK? (if you haven't changed the default just press enter)",
            default: 'C:\\tizen-studio',
            validate(value) {
                if (fsExistsSync(value)) return true;
                return 'Path does not exist';
            }
        });

        await inquirer.prompt({
            type: 'confirm',
            name: 'toolsInstalled',
            message:
                'Please open Package Manager and install: Tizen SDK Tools (Main SDK), TV Extensions-* (Extension SDK). Continue after you finished installing them.',
            validate() {
                return (
                    fsExistsSync(
                        path.join(res.sdkPath, 'tools/ide/bin/tizen.bat')
                    ) || 'This does not look like a Tizen SDK path'
                );
            }
        });

        this.tizenSdkPath = res.sdkPath;
    }

    async installWebosSdk() {
        const { downloadLink } = setupConfig.webos;
        logInfo(
            `Opening ${
                downloadLink
            }. Please download and install the SDK then continue after it finished installing.
Make sure you also install the CLI and Emulator components`
        );
        exec(`${openCommand} ${downloadLink}`);
        const res = await inquirer.prompt({
            type: 'input',
            name: 'sdkPath',
            message:
                "Where did you install the SDK? (if you haven't changed the default just press enter)",
            default: 'C:\\webOS_TV_SDK',
            validate(value) {
                if (fsExistsSync(value)) return true;
                return 'Path does not exist';
            }
        });

        await inquirer.prompt({
            type: 'confirm',
            name: 'toolsInstalled',
            message: 'Are the CLI and Emulator components installed?',
            validate() {
                return (
                    fsExistsSync(
                        path.join(res.sdkPath, 'tools/ide/bin/tizen.bat')
                    ) || 'This does not look like a Tizen SDK path'
                );
            }
        });

        this.webosSdkPath = res.sdkPath;
    }
}

export default LinuxPlatformSetup;
