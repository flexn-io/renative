import path from 'path';
import {
    getPlatformProjectDir,
    getTemplateProjectDir,
    getAppTitle,
    getAppDescription,
    getAppAuthor,
} from '../core/common';
import { fsExistsSync, getRealPath, fsWriteFileSync, fsReadFileSync } from '../core/systemManager/fileutils';
import { chalk, logTask } from '../core/systemManager/logger';
import { isPlatformActive } from '../core/platformManager';
import {
    copyBuildsFolder,
    copyAssetsFolder
} from '../core/projectManager/projectParser';
import { KAIOS_SDK } from '../core/constants';

import { buildWeb, configureCoreWebProject } from '../sdk-webpack';

const childProcess = require('child_process');

const launchKaiOSSimulator = c => new Promise((resolve, reject) => {
    logTask('launchKaiOSSimulator');

    if (!c.buildConfig?.sdks?.KAIOS_SDK) {
        reject(
            `${KAIOS_SDK} is not configured in your ${
                c.paths.workspace.config
            } file. Make sure you add location to your Kaiosrt App path similar to: ${chalk().white.bold(
                '"KAIOS_SDK": "/Applications/Kaiosrt.app"'
            )}`
        );
        return;
    }

    const ePath = getRealPath(
        path.join(c.buildConfig?.sdks?.KAIOS_SDK)
    );

    if (!fsExistsSync(ePath)) {
        reject(`Can't find emulator at path: ${ePath}`);
        return;
    }

    childProcess.exec(`open ${ePath}`, (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
});

const configureKaiOSProject = async (c) => {
    logTask('configureKaiOSProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = `${getPlatformProjectDir(c)}`;

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject(c);
    await configureProject(c);
    return copyBuildsFolder(c, platform);
};

const configureProject = c => new Promise((resolve) => {
    logTask('configureProject');
    const { platform } = c;

    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getPlatformProjectDir(c);
    const templateFolder = getTemplateProjectDir(c, platform);

    const manifestFilePath = path.join(templateFolder, 'manifest.webapp');
    const manifestFilePath2 = path.join(appFolder, 'manifest.webapp');
    const manifestFile = JSON.parse(fsReadFileSync(manifestFilePath));

    manifestFile.name = `${getAppTitle(c, platform)}`;
    manifestFile.description = `${getAppDescription(c, platform)}`;
    manifestFile.developer = getAppAuthor(c, platform);

    fsWriteFileSync(
        manifestFilePath2,
        JSON.stringify(manifestFile, null, 2)
    );

    resolve();
});

const runFirefoxProject = async (c) => {
    logTask('runFirefoxProject');
    const { platform } = c;

    await buildWeb(c);
    await launchKaiOSSimulator(c, platform);
    return true;
};

const buildFirefoxProject = async (c) => {
    logTask('buildFirefoxProject');

    await buildWeb(c);
    return true;
};

export {
    launchKaiOSSimulator,
    configureKaiOSProject,
    runFirefoxProject,
    buildFirefoxProject
};
