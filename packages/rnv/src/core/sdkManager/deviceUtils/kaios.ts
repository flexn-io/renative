import path from 'path';

import { fsExistsSync, getRealPath } from '../../systemManager/fileutils';
import { chalk, logTask } from '../../systemManager/logger';
import { KAIOS_SDK } from '../../constants';

const childProcess = require('child_process');

export const launchKaiOSSimulator = (c) =>
    new Promise((resolve, reject) => {
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

        const ePath = getRealPath(path.join(c.buildConfig?.sdks?.KAIOS_SDK));

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
