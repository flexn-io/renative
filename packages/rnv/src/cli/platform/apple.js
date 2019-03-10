import fs from 'fs';
import path from 'path';
import { logTask, logError } from '../../common';
import { BasePlatform } from './base';
import { mkdirSync, writeFileAsync } from '../../fileutils';
import { executeAsync } from '../../exec';

export default class ApplePlatform extends BasePlatform {
    async runSetupProject(config) {
        await super.runSetupProject(config);
        const buildFolder = await this.getBuildFolder(config);
        await this.runPod(config.program.update ? 'update' : 'install', buildFolder);
        await this.copyAssets(config);
        await this.configureXcodeProject(config);
        return Promise.resolve();
    }

    async configureXcodeProject(config) {
        const { platform } = this.constructor;
        logTask(`configureXcodeProject:${platform}`);
        const appFolderName = this.getAppFolder();
        if (!this.isPlatformActive(config)) throw new Error(`Platform ${platform} is not active`);
        const buildFolder = this.getBuildFolder(config);
        await writeFileAsync(path.join(buildFolder, 'main.jsbundle'), '{}');
        mkdirSync(path.join(buildFolder, 'assets'));
        mkdirSync(path.join(buildFolder, `${appFolderName}/images`));
    }

    async runPod(command, cwd) {
        logTask(`runPod:${command}`);

        const existsFolder = await fs.exists(cwd);

        if (!existsFolder) {
            const errorMsg = `Location ${cwd} does not exists!`;
            logError(errorMsg);
            throw new Error(errorMsg);
        }

        await executeAsync('pod', [
            command,
        ], {
            cwd,
            evn: process.env,
            stdio: 'inherit',
        });
    }
}
