import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    MACOS,
    WINDOWS,
    TASK_BUILD, TASK_EXPORT,
} from '../core/constants';
import {
    exportElectron
} from '../sdk-electron';
import { executeTask } from '../core/engineManager';


export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return exportElectron(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: '',
    fn: taskRnvExport,
    task: 'export',
    params: [],
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
