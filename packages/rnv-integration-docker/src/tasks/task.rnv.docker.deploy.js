import { Logger, Constants } from 'rnv';
import Docker from '../docker';

const { logTask } = Logger;
const { PARAMS, WEB } = Constants;

export const taskRnvDockerDeploy = async (c) => {
    logTask('taskRnvDockerDeploy');
    const docker = new Docker(c);
    docker.doDeploy();
};

export default {
    description: 'Deploys your project to docker image',
    fn: taskRnvDockerDeploy,
    task: 'docker deploy',
    params: PARAMS.withBase(),
    platforms: [
        WEB
    ],
};
