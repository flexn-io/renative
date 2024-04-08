import { createTask, RnvTaskName } from '@rnv/core';
import Docker from '../docker';

export default createTask({
    dependsOn: [RnvTaskName.export],
    description: 'Deploys your project to docker image',
    fn: async () => {
        const docker = new Docker();
        return docker.doDeploy();
    },
    task: 'docker deploy',
    platforms: ['web'],
});
