/* eslint-disable no-unused-vars */
import path from 'path';
import { logTask, logWarning } from '../../common';
import { copyFolderContentsRecursiveSync } from '../../fileutils';

export class BasePlatform {
    static async runSetupProject(config) {
        const { platform } = this;
        logTask(`runSetupProject:${platform}`);
        return this.isPlatformActive(config);
    }

    static async isPlatformActive(config) {
        const { platform } = this;
        return new Promise((resolve, reject) => {
            if (!config.appConfigFile.platforms[platform]) {
                const msg = `Platform ${platform} not configured for ${config.appId}. skipping.`;
                console.error(msg);
                reject(msg);
            } else {
                resolve();
            }
        });
    }

    static async copyAssets(config) {
        const { platform, defaultAppFolder } = this.constructor;
        logTask(`copyAssets:${platform}`);
        const appFolderName = this.getAppFolder();
        const targetPath = path.join(this.getBuildFolder(config), appFolderName);
        const sPath = path.join(config.appConfigFolder, `assets/${platform}`);
        logWarning(`Copying assets from ${sPath} to ${targetPath} appFolder for ${platform}`);
        await copyFolderContentsRecursiveSync(sPath, targetPath); // TODO: change to async
    }

    static getBuildFolder(config) {
        const { platform } = this.constructor;
        return path.join(config.platformBuildsFolder, `${config.appId}_${platform}`);
    }

    static getAppFolder(config) {
        const { platform, defaultAppFolder } = this.constructor;
        let appFolderName;
        try {
            // eslint-disable-next-line prefer-destructuring
            appFolderName = config.appConfigFile.platforms[platform].appFolderName;
        } catch (error) {
            // Use default
        }
        if (!appFolderName) {
            appFolderName = defaultAppFolder;
        }
        return appFolderName;
    }
}

BasePlatform.platform = 'noop';
