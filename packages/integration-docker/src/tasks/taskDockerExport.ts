import { createTask, RnvTaskName } from '@rnv/core';
import Docker from '../docker';

export default createTask({
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
});
