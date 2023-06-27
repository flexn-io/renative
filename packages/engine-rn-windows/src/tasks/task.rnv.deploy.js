import { Constants, Logger, PlatformManager, TaskManager } from 'rnv';
import { SDKWindows } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { WINDOWS, XBOX, TASK_EXPORT, TASK_DEPLOY, PARAMS } = Constants;
// TODO Implement export windows app (currently it only seems to be available through VS Studio itself...)
const { ruWindowsProject } = SDKWindows;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvDeploy = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    if (shouldSkipTask(c, TASK_DEPLOY, originTask)) return true;

    switch (platform) {
        case XBOX:
        case WINDOWS:
            return ruWindowsProject(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: TASK_DEPLOY,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WINDOWS, XBOX],
};
