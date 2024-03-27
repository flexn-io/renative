import { executeTask, configureRuntimeDefaults, isPlatformSupported, createTask, RnvTaskName } from '@rnv/core';
import { isBuildSchemeSupported } from '../../buildSchemes';

export default createTask({
    description: 'Configure system and project without recreating files (used for --only)',
    fn: async ({ taskName, originTaskName }) => {
        await configureRuntimeDefaults();
        await executeTask({ taskName: RnvTaskName.appConfigure, parentTaskName: taskName, originTaskName });

        await isPlatformSupported();
        await isBuildSchemeSupported();

        await executeTask({
            taskName: RnvTaskName.sdkConfigure,
            parentTaskName: taskName,
            originTaskName,
            isOptional: true,
        });

        await configureRuntimeDefaults();
        return true;
    },
    task: RnvTaskName.configureSoft,
    isPrivate: true,
});
