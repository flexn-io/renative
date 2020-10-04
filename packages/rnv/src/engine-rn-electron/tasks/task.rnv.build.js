import { logTask } from '../../core/systemManager/logger';
import { MACOS,
    WINDOWS,
    TASK_BUILD, TASK_PACKAGE,
    PARAMS } from '../../core/constants';
import { logErrorPlatform } from '../../core/platformManager';
import { buildElectron } from '../../sdk-electron';
import { executeOrSkipTask } from '../../core/engineManager';

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);
    switch (platform) {
        case MACOS:
        case WINDOWS:
            await buildElectron(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: 'build',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
