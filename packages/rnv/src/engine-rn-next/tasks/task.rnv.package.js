import { logTask } from '../../core/systemManager/logger';
import { WEB,
    CHROMECAST,
    TASK_PACKAGE,
    TASK_CONFIGURE,
    PARAMS } from '../../core/constants';
import { executeOrSkipTask } from '../../core/engineManager';

export const taskRnvPackage = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    return true;
};

export default {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: 'package',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        WEB,
        CHROMECAST,
    ],
};
