import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import { MACOS, WINDOWS, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE } from '../core/constants';
import { configureElectronProject } from '../sdk-electron';
import { executeTask } from '../core/engineManager';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure', `parent:${parentTask} origin:${originTask}`);

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    switch (c.platform) {
        case MACOS:
        case WINDOWS:
            return configureElectronProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: '',
    fn: taskRnvConfigure,
    task: 'configure',
    params: [],
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
