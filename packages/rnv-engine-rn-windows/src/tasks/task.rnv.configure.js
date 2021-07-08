import { Common, Constants, Logger, PlatformManager, ProjectManager, TaskManager, TemplateManager } from 'rnv';
import { SDKWindows } from '../sdks';

const { logErrorPlatform, copySharedPlatforms, isPlatformActive } = PlatformManager;
const { logTask } = Logger;
const {
    WINDOWS,
    TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE,
    PARAMS
} = Constants;

// TO DO implement configure
const { ruWindowsProject } = SDKWindows;
const { executeTask, shouldSkipTask } = TaskManager;
const { configureEntryPoint } = TemplateManager;
const { copyBuildsFolder, copyAssetsFolder } = ProjectManager;
const { getPlatformProjectDir } = Common;


export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);
    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;
    await configureEntryPoint(c, c.platform);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case WINDOWS:
            return ruWindowsProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export const configureWebProject = async (c) => {
    logTask('configureWebProject');

    const { platform } = c;

    c.runtime.platformBuildsProjectPath = getPlatformProjectDir(c);

    if (!isPlatformActive(c, platform)) return;

    await copyAssetsFolder(c, platform);
    // await configureCoreWebProject(c);

    return copyBuildsFolder(c, platform);
};

export default {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TASK_CONFIGURE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        WINDOWS
    ],
};
