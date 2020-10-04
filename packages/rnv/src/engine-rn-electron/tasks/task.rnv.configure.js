import { logErrorPlatform, copySharedPlatforms } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { MACOS, WINDOWS, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, PARAMS } from '../../core/constants';
import { configureElectronProject } from '../../sdk-electron';
import { executeTask } from '../../core/engineManager';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case MACOS:
        case WINDOWS:
            return configureElectronProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: 'configure',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
