import { runWebpackServer } from '@rnv/sdk-webpack';
import { getConfigProp, RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { REMOTE_DEBUGGER_ENABLED_PLATFORMS } from '@rnv/sdk-utils';
import { EnginePlatforms } from '../constants';

export default createTask({
    description: 'Starts bundler / server',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ ctx }) => {
        const { platform, program } = ctx;
        const { hosted } = program.opts();

        const bundleAssets = getConfigProp('bundleAssets');
        const isWeinreEnabled =
            (platform && REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted) || undefined;

        return runWebpackServer(isWeinreEnabled);
    },
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: EnginePlatforms,
});
