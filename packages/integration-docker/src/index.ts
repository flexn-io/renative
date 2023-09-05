import taskRnvDockerDeploy from './tasks/task.rnv.docker.deploy';
import taskRnvDockerExport from './tasks/task.rnv.docker.export';
//@ts-ignore
import config from '../renative.integration.json';

const TASKS = [taskRnvDockerExport, taskRnvDockerDeploy];

const getTasks = () => TASKS;

export default {
    getTasks,
    config,
};
