/* eslint-disable import/no-cycle */
import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    MACOS,
    WINDOWS,
    TASK_RUN,
    TASK_CONFIGURE
} from '../core/constants';
import {
    runElectron,
} from '../sdk-electron';
import { executeTask as _executeTask } from '../core/engineManager';


export const taskRnvRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('_taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await _executeTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return runElectron(c);
        default:
            return logErrorPlatform(c);
    }
};
