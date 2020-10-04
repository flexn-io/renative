import { logTask } from '../../core/systemManager/logger';
import { isBuildSchemeSupported } from '../../core/configManager/schemeParser';
import { isPlatformSupported } from '../../core/platformManager';
import { configureRuntimeDefaults } from '../../core/configManager/configParser';
import { executeTask } from '../../core/engineManager';
import { TASK_APP_CONFIGURE, TASK_CONFIGURE_SOFT, PARAMS } from '../../core/constants';
import { checkSdk } from '../../core/sdkManager';


export const taskRnvConfigureSoft = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigureSoft');

    await configureRuntimeDefaults(c);
    await executeTask(c, TASK_APP_CONFIGURE, parentTask, originTask);
    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkSdk(c);
    await configureRuntimeDefaults(c);
    return true;
};

export default {
    description: 'Configure system and project wothout recreating files (used for --only)',
    fn: taskRnvConfigureSoft,
    task: TASK_CONFIGURE_SOFT,
    params: PARAMS.withBase(),
    platforms: [],
};
