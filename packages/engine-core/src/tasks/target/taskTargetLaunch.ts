import {
    isPlatformSupported,
    chalk,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    RnvTaskFn,
    inquirerPrompt,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { checkAndConfigureSdks, checkSdk } from '../../common';
import { launchAndroidSimulator } from '@rnv/sdk-android';
import { launchAppleSimulator } from '@rnv/sdk-apple';
import { launchTizenSimulator } from '@rnv/sdk-tizen';
import { launchWebOSimulator } from '@rnv/sdk-webos';
import { launchKaiOSSimulator } from '@rnv/sdk-kaios';

const taskTargetLaunch: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskTargetLaunch');

    await isPlatformSupported(true);
    await checkAndConfigureSdks();
    await executeTask(RnvTaskName.workspaceConfigure, RnvTaskName.targetLaunch, originTask);

    const { platform, program } = c;
    let target = program?.target;
    const options = [];

    if (platform && !target) {
        const projectTarget = c.files.project.configLocal?.defaultTargets?.[platform];
        if (projectTarget) {
            options.push({ name: `${projectTarget} (project default)`, value: projectTarget });
        }
        const workspaceTarget = c.files.workspace.config?.defaultTargets?.[platform];
        if (workspaceTarget) {
            options.push({ name: `${workspaceTarget} (global default)`, value: workspaceTarget });
        }

        options.push({ name: 'Pick from available targets...', value: true });

        const { selectedOption } = await inquirerPrompt({
            name: 'selectedOption',
            type: 'list',
            message: 'Which target to use?',
            choices: options,
        });

        if (selectedOption) {
            target = selectedOption;
        }
    }

    await checkSdk();

    switch (platform) {
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
            return launchAndroidSimulator(target);
        case 'ios':
        case 'tvos':
            return launchAppleSimulator(target);
        case 'tizen':
            return launchTizenSimulator(target);
        case 'webos':
            return launchWebOSimulator(target);
        case 'kaios':
            return launchKaiOSSimulator(target);
        default:
            return Promise.reject(
                `"target launch" command does not support ${chalk().white.bold(
                    platform
                )} platform yet. You will have to launch the target manually. Working on it!`
            );
    }
};

const Task: RnvTask = {
    description: 'Launch specific target',
    fn: taskTargetLaunch,
    task: RnvTaskName.targetLaunch,
    options: RnvTaskOptionPresets.withBase(),
    platforms: null,
    isGlobalScope: true,
};

export default Task;
