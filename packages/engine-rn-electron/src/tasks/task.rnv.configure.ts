import { Constants, Logger, PlatformManager, RnvTaskFn, TaskManager, TemplateManager } from 'rnv';
import { SDKElectron } from '../sdks';

const { logErrorPlatform, copySharedPlatforms } = PlatformManager;
const { logTask } = Logger;
const { MACOS, WINDOWS, LINUX, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, PARAMS } = Constants;
const { configureElectronProject } = SDKElectron;
const { executeTask, shouldSkipTask } = TaskManager;
const { configureEntryPoint } = TemplateManager;

export const taskRnvConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case MACOS:
        case WINDOWS:
        case LINUX:
            return configureElectronProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TASK_CONFIGURE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS, WINDOWS, LINUX],
};
