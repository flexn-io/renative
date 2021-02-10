import { TaskManager, Constants, Logger, PlatformManager, TemplateManager } from 'rnv';
import { SDKElectron } from '../sdks';

const { logErrorPlatform, copySharedPlatforms } = PlatformManager;
const { logTask } = Logger;
const { MACOS, WINDOWS, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, PARAMS } = Constants;
const { configureElectronProject } = SDKElectron;
const { executeTask } = TaskManager;
const { configureEntryPoint } = TemplateManager;

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);
    await configureEntryPoint(c, c.platform);

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
