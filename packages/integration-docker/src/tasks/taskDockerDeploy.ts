import { RnvTask, RnvTaskName } from '@rnv/core';
import Docker from '../docker';

const Task: RnvTask = {
    dependsOn: [RnvTaskName.export],
    description: 'Deploys your project to docker image',
    fn: async () => {
        const docker = new Docker();
        return docker.doDeploy();
    },
    task: 'docker deploy',
    platforms: ['web'],
};

export default Task;
