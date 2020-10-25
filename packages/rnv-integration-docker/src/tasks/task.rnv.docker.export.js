import { Logger, Constants } from 'rnv';
import Docker from '../docker';

const { logTask } = Logger;
const { PARAMS, WEB } = Constants;

export const taskRnvDockerExport = async (c) => {
    logTask('taskRnvDockerExport');
    const docker = new Docker(c);
    docker.doExport();
};

export default {
    description: 'Exports your project to docker image',
    fn: taskRnvDockerExport,
    task: 'docker export',
    params: PARAMS.withBase(),
    platforms: [
        WEB
    ],
};
