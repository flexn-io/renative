import { fsExistsSync, getRealPath, chalk, logDefault, RnvError, RnvContext, logError, executeAsync, logSuccess, inquirerPrompt, getDirectories } from '@rnv/core';
import path from 'path';

const childProcess = require('child_process');

export const launchKaiOSSimulator = async (c: RnvContext, target: string | boolean) => {
    logDefault(`launchKaiOSSimulator: ${target}`);

    const kaiosSdkPath = getRealPath(c, c.buildConfig?.sdks?.KAIOS_SDK);

    if (!kaiosSdkPath) {
        return Promise.reject(
            `KAIOS_SDK is not configured in your ${
                c.paths.workspace.config
            } file. Make sure you add location to your Kaiosrt App path similar to: ${chalk().white.bold(
                '"KAIOS_SDK": "/Users/<USER>/Library/Kaiosrtv3.0"'
            )}`
        );
    }

    if(target === true){
        let availableSimulatorVersions = getDirectories(kaiosSdkPath).filter(directory=> directory.toLowerCase().indexOf("kaios") !== -1);

        const { selectedSimulator } = await inquirerPrompt({
            name: 'selectedSimulator',
            type: 'list',
            message: 'What simulator would you like to launch?',
            choices: availableSimulatorVersions,
        });
        target = selectedSimulator
    }

    const simulatorPath = path.join(kaiosSdkPath, `${target}/kaiosrt/kaiosrt`);

    if (simulatorPath && !fsExistsSync(simulatorPath)) {
        return Promise.reject(`Can't find simulator at path: ${simulatorPath}`);
    }

    new Promise<void>((resolve, reject) => {
        childProcess.exec(`(cd ${kaiosSdkPath} && ${simulatorPath} )`, (err: RnvError) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
