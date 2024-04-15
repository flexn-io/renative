import { executeAsync, createTask, RnvTaskName } from '@rnv/core';

export default createTask({
    description: 'Debug your app on target device or emulator',
    fn: async () => {
        return executeAsync('npx weinre --boundHost -all-');
    },
    task: RnvTaskName.debug,
    platforms: ['web', 'webtv', 'tizen', 'kaios'],
});
