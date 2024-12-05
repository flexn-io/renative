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
import { updateDefaultTargets } from '@rnv/sdk-utils';
import path from 'path';

export const launchKaiOSSimulator = async (target: string | boolean) => {
    const c = getContext();
    logDefault(`launchKaiOSSimulator: ${target}`);
    if (!c.platform) return;
    const defaultTarget = c.buildConfig.defaultTargets?.[c.platform];
    const kaiosSdkPath = getRealPath(c.buildConfig?.sdks?.KAIOS_SDK);

    if (!kaiosSdkPath) {
        return Promise.reject(`c.buildConfig.sdks.KAIOS_SDK undefined`);
    }

    const availableSimulatorVersions = getDirectories(kaiosSdkPath).filter(
        (directory) => directory.toLowerCase().indexOf('kaios') !== -1
    );

    if (typeof target === 'boolean') {
        const { selectedSimulator } = await inquirerPrompt({
            name: 'selectedSimulator',
            type: 'list',
            message: 'What simulator would you like to launch?',
            choices: availableSimulatorVersions,
        });
        target = selectedSimulator;
        if (!defaultTarget || defaultTarget !== selectedSimulator) {
            await updateDefaultTargets(c, selectedSimulator);
        }
    } else if (typeof target === 'string' && !availableSimulatorVersions.includes(target)) {
        logWarning(
            `${
                defaultTarget && !c.program.opts().target
                    ? `The default target specified in ${chalk().cyan(c.paths.dotRnv.config)} or ${chalk().cyan(
                          c.paths.project.configLocal
                      )}`
                    : 'Target'
            } with name ${chalk().red(target)} does not exist.`
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
