import {
    isPlatformSupported,
    chalk,
    logTask,
    IOS,
    ANDROID,
    TVOS,
    TIZEN,
    WEBOS,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    KAIOS,
    TASK_WORKSPACE_CONFIGURE,
    TASK_TARGET_LAUNCH,
    PARAMS,
    executeTask,
    RnvTaskFn,
    inquirerPrompt,
} from '@rnv/core';
import { checkAndConfigureSdks, checkSdk } from '../common';

import { launchAndroidSimulator } from '@rnv/sdk-android';
import { launchAppleSimulator } from '@rnv/sdk-apple';
import { launchTizenSimulator } from '@rnv/sdk-tizen';
import { launchWebOSimulator } from '@rnv/sdk-webos';
import { launchKaiOSSimulator } from '@rnv/sdk-kaios';

export const taskRnvTargetLaunch: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvTargetLaunch');

    await isPlatformSupported(c, true);
    await checkAndConfigureSdks(c);
    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_TARGET_LAUNCH, originTask);

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

        options.push({ name: 'Pick from available targets...', value: null });

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

    await checkSdk(c);

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            return launchAndroidSimulator(c, target);
        case IOS:
        case TVOS:
            return launchAppleSimulator(c, target);
        case TIZEN:
            return launchTizenSimulator(c, target);
        case WEBOS:
            return launchWebOSimulator(c);
        case KAIOS:
            return launchKaiOSSimulator(c);
        default:
            return Promise.reject(
                `"target launch" command does not support ${chalk().white.bold(
                    platform
                )} platform yet. You will have to launch the emulator manually. Working on it!`
            );
    }
};

export default {
    description: 'Launch specific emulator',
    fn: taskRnvTargetLaunch,
    task: 'target launch',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};
