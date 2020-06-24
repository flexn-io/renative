/* eslint-disable import/no-cycle */

import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    getAppFolder,
    getAppTitle,
    getAppTemplateFolder,
    getAppDescription,
    getAppAuthor,
} from '../../common';
import { logTask } from '../../systemTools/logger';
import { isPlatformActive } from '..';
import {
    copyBuildsFolder,
    copyAssetsFolder
} from '../../projectTools/projectParser';
import { KAIOS_SDK } from '../../constants';
import { getRealPath, fsWriteFileSync } from '../../systemTools/fileutils';
import { buildWeb, configureCoreWebProject } from '../web';

const childProcess = require('child_process');

const launchKaiOSSimulator = c => new Promise((resolve, reject) => {
    logTask('launchKaiOSSimulator');

    if (!c.buildConfig?.sdks?.KAIOS_SDK) {
        reject(
            `${KAIOS_SDK} is not configured in your ${
                c.paths.workspace.config
            } file. Make sure you add location to your Kaiosrt App path similar to: ${chalk.white.bold(
                '"KAIOS_SDK": "/Applications/Kaiosrt.app"'
            )}`
        );
        return;
    }

    const ePath = getRealPath(
        path.join(c.buildConfig?.sdks?.KAIOS_SDK)
    );

    if (!fs.existsSync(ePath)) {
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

const configureKaiOSProject = async (c, platform) => {
    logTask('configureKaiOSProject');

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);
    await configureCoreWebProject(c, platform);
    await configureProject(c, platform);
    return copyBuildsFolder(c, platform);
};

const configureProject = (c, platform) => new Promise((resolve) => {
    logTask(`configureProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);

    const manifestFilePath = path.join(templateFolder, 'manifest.webapp');
    const manifestFilePath2 = path.join(appFolder, 'manifest.webapp');
    const manifestFile = JSON.parse(fs.readFileSync(manifestFilePath));

    manifestFile.name = `${getAppTitle(c, platform)}`;
    manifestFile.description = `${getAppDescription(c, platform)}`;
    manifestFile.developer = getAppAuthor(c, platform);

    fsWriteFileSync(
        manifestFilePath2,
        JSON.stringify(manifestFile, null, 2)
    );

    resolve();
});

const runFirefoxProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`runFirefoxProject:${platform}`);

    buildWeb(c, platform)
        .then(() => launchKaiOSSimulator(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const buildFirefoxProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`buildFirefoxProject:${platform}`);

    buildWeb(c, platform)
        .then(() => resolve())
        .catch(e => reject(e));
});

export {
    launchKaiOSSimulator,
    configureKaiOSProject,
    runFirefoxProject,
    buildFirefoxProject
};
