import { executeAsync, RnvTask, RnvTaskName } from '@rnv/core';

const Task: RnvTask = {
    description: 'Debug your app on target device or emulator',
    fn: async () => {
        return executeAsync('npx weinre --boundHost -all-');
    },
    task: RnvTaskName.debug,
    platforms: ['web', 'webtv', 'tizen'],
};

export default Task;
