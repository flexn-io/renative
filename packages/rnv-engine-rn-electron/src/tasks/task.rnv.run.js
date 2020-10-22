import { EngineManager, Constants, Logger, PlatformManager, SDKElectron } from 'rnv';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const {
    MACOS,
    WINDOWS,
    TASK_RUN,
    TASK_CONFIGURE,
    PARAMS
} = Constants;
const { runElectron } = SDKElectron;
const { executeOrSkipTask } = EngineManager;

export const taskRnvRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return runElectron(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app on target device or emulator',
    fn: taskRnvRun,
    task: 'run',
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
