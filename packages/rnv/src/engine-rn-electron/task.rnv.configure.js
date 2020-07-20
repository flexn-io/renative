/* eslint-disable import/no-cycle */
import { configureGenericPlatform, logErrorPlatform } from '../core/platformManager';
import { configureGenericProject } from '../core/projectManager';
import { logTask } from '../core/systemManager/logger';
import {
    MACOS,
    WINDOWS,
} from '../core/constants';
import {
    configureElectronProject,
} from '../sdk-electron';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure', `parent:${parentTask} origin:${originTask}`);

    await configureGenericPlatform(c);
    await configureGenericProject(c);

    switch (c.platform) {
        case MACOS:
        case WINDOWS:
            return configureElectronProject(c);
        default:
            return logErrorPlatform(c);
    }
};
