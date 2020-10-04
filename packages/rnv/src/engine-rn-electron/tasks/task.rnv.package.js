import { logTask } from '../../core/systemManager/logger';
import { MACOS, WINDOWS, TASK_PACKAGE, TASK_CONFIGURE, PARAMS } from '../../core/constants';
import { executeOrSkipTask } from '../../core/engineManager';

export const taskRnvPackage = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    // macOS does not require packaging
    return true;
};

export default {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: TASK_PACKAGE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
