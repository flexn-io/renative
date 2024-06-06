import {
    fsExistsSync,
    getRealPath,
    logDefault,
    inquirerPrompt,
    getDirectories,
    getContext,
    executeAsync,
    ExecOptionsPresets,
    logToSummary,
} from '@rnv/core';
import path from 'path';

export const launchKaiOSSimulator = async (target: string | boolean) => {
    const c = getContext();
    logDefault(`launchKaiOSSimulator: ${target}`);

    const kaiosSdkPath = getRealPath(c.buildConfig?.sdks?.KAIOS_SDK);

    if (!kaiosSdkPath) {
        return Promise.reject(`c.buildConfig.sdks.KAIOS_SDK undefined`);
    }

    if (target === true) {
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

export const listKaiosTargets = async () => {
    const c = getContext();

    const kaiosSdkPath = getRealPath(c.buildConfig?.sdks?.KAIOS_SDK);

    if (!kaiosSdkPath) {
        return Promise.reject(`c.buildConfig.sdks.KAIOS_SDK undefined`);
    }

    const availableSimulatorVersions = getDirectories(kaiosSdkPath).filter(
        (directory) => directory.toLowerCase().indexOf('kaios') !== -1
    );

    // availableSimulatorVersions.map((a) => {
    //     deviceArray.push(` [${deviceArray.length + 1}]> ${chalk().bold(a)} | simulator`);
    // });

    logToSummary(`Kaios Targets:\n${availableSimulatorVersions.join('\n')}`);

    return true;
};
