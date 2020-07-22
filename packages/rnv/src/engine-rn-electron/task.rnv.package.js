import { logTask } from '../core/systemManager/logger';
import { MACOS, WINDOWS, TASK_PACKAGE, TASK_CONFIGURE } from '../core/constants';
import { executeTask } from '../core/engineManager';

export const taskRnvPackage = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);

    await executeTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    // macOS does not require packaging
    return true;
};

export default {
    description: '',
    fn: taskRnvPackage,
    task: TASK_PACKAGE,
    params: [],
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
