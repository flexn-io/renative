import { RnvTask, RnvTaskName } from '@rnv/core';
import Docker from '../docker';

const Task: RnvTask = {
    description: 'Exports your project to docker image',
    // TODO: we need to do this differently
    // Project neds to define pipeline of tasks instead of integration
    dependsOn: [RnvTaskName.export],
    fn: async () => {
        const docker = new Docker();
        await docker.doExport();
    },
    task: 'docker export',
    platforms: ['web'],
};

export default Task;
