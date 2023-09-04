import { TaskManager, Constants, Logger, PlatformManager, TemplateManager } from 'rnv';
import { configureXcodeProject } from '@rnv/sdk-apple';
import { configureMetroConfigs } from '../commonEngine';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { MACOS, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, PARAMS } = Constants;

const { executeTask, shouldSkipTask } = TaskManager;
const { configureEntryPoint } = TemplateManager;

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await configureMetroConfigs(c);

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);
    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case MACOS:
            await configureXcodeProject(c);
            return true;
        default:
            await logErrorPlatform(c);
            return true;
    }
};

export default {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: 'configure',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS],
};
