import { RnvTaskOptionPresets, createTask, RnvTaskName } from '@rnv/core';
import { buildWebNext } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

export default createTask({
    description: 'Build project binary',
    dependsOn: [RnvTaskName.configure],
    fn: async () => {
        await buildWebNext();
    },
    task: RnvTaskName.build,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
});
