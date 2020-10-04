import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { MACOS,
    WINDOWS,
    TASK_BUILD, TASK_EXPORT,
    PARAMS } from '../../core/constants';
import {
    exportElectron
} from '../../sdk-electron';
import { executeOrSkipTask } from '../../core/engineManager';


export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return exportElectron(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: 'export',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
