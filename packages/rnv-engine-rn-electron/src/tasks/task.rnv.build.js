import { TaskManager, Constants, Logger, PlatformManager, SDKElectron } from 'rnv';

const { logTask } = Logger;
const {
    MACOS,
    WINDOWS,
    TASK_BUILD, TASK_PACKAGE,
    PARAMS
} = Constants;
const { logErrorPlatform } = PlatformManager;
const { buildElectron } = SDKElectron;
const { executeOrSkipTask } = TaskManager;

export const taskRnvBuild = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);
    switch (platform) {
        case MACOS:
        case WINDOWS:
            await buildElectron(c);
            return;
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: 'build',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
