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
    logWarning,
    chalk,
} from '@rnv/core';
import path from 'path';

export const launchKaiOSSimulator = async (target: string | boolean) => {
    const c = getContext();
    logDefault(`launchKaiOSSimulator: ${target}`);

    const kaiosSdkPath = getRealPath(c.buildConfig?.sdks?.KAIOS_SDK);

    if (!kaiosSdkPath) {
        return Promise.reject(`c.buildConfig.sdks.KAIOS_SDK undefined`);
    }

    const availableSimulatorVersions = getDirectories(kaiosSdkPath).filter(
        (directory) => directory.toLowerCase().indexOf('kaios') !== -1
    );

    if (target === true) {
        const { selectedSimulator } = await inquirerPrompt({
            name: 'selectedSimulator',
            type: 'list',
            message: 'What simulator would you like to launch?',
            choices: availableSimulatorVersions,
        });
        target = selectedSimulator;
    } else if (typeof target === 'string' && !availableSimulatorVersions.includes(target)) {
        logWarning(
            `Target with name ${chalk().red(target)} does not exist. You can update it here: ${chalk().cyan(
                c.paths.dotRnv.config
            )}`
        );
        await launchKaiOSSimulator(true);
        return true;
    }

    const simulatorPath = path.join(kaiosSdkPath, `${target}/kaiosrt/kaiosrt`);

    if (simulatorPath && !fsExistsSync(simulatorPath)) {
        return Promise.reject(`Can't find simulator at path: ${simulatorPath}`);
    }

    await executeAsync(simulatorPath, {
        cwd: `${kaiosSdkPath}/${target}/kaiosrt`,
        ...ExecOptionsPresets.NO_SPINNER_FULL_ERROR_SUMMARY,
    });
    return Promise.reject(`The Simulator can't be launched because it is already in use.`);
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
