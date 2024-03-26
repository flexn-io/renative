import { logError, RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { runWebNext } from '../sdk/runner';
import { openBrowser, waitForHost } from '@rnv/sdk-utils';
import { SdkPlatforms } from '../sdk/constants';

const Task: RnvTask = {
    description: 'Starts bundler / server',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ ctx }) => {
        const { localhost, port } = ctx.runtime;
        waitForHost()
            .then(() => openBrowser(`http://${localhost}:${port}/`))
            .catch(logError);
        return runWebNext();
    },
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
