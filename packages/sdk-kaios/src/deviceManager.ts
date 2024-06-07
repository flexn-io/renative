import {
    fsExistsSync,
    getRealPath,
    logDefault,
    inquirerPrompt,
    getDirectories,
    getContext,
    executeAsync,
    ExecOptionsPresets,
} from '@rnv/core';
import path from 'path';

export const launchKaiOSSimulator = async (target: string | boolean) => {
    const c = getContext();
    logDefault(`launchKaiOSSimulator: ${target}`);

    const kaiosSdkPath = getRealPath(c.buildConfig?.sdks?.KAIOS_SDK);

    if (!kaiosSdkPath) {
        return Promise.reject(`c.buildConfig.sdks.KAIOS_SDK undefined`);
    }

    if (typeof target !== 'string') {
        const availableSimulatorVersions = getDirectories(kaiosSdkPath).filter(
            (directory) => directory.toLowerCase().indexOf('kaios') !== -1
        );

        const { selectedSimulator } = await inquirerPrompt({
            name: 'selectedSimulator',
            type: 'list',
            message: 'What simulator would you like to launch?',
            choices: availableSimulatorVersions,
        });
        target = selectedSimulator;
    }

    const simulatorPath = path.join(kaiosSdkPath, `${target}/kaiosrt/kaiosrt`);

    if (simulatorPath && !fsExistsSync(simulatorPath)) {
        return Promise.reject(`Can't find simulator at path: ${simulatorPath}`);
    }

    await executeAsync(simulatorPath, {
        cwd: `${kaiosSdkPath}/${target}/kaiosrt`,
        ...ExecOptionsPresets.NO_SPINNER_FULL_ERROR_SUMMARY,
    });
};
