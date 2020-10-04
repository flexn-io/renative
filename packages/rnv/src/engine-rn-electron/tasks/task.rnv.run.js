import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { MACOS,
    WINDOWS,
    TASK_RUN,
    TASK_CONFIGURE,
    PARAMS } from '../../core/constants';
import { runElectron } from '../../sdk-electron';
import { executeOrSkipTask } from '../../core/engineManager';

export const taskRnvRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return runElectron(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app on target device or emulator',
    fn: taskRnvRun,
    task: 'run',
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
