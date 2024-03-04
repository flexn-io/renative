import taskDockerDeploy from './tasks/taskDockerDeploy';
import taskDockerExport from './tasks/taskDockerExport';
//@ts-ignore
import config from '../renative.integration.json';

const TASKS = [taskDockerExport, taskDockerDeploy];

const getTasks = () => TASKS;

export default {
    getTasks,
    config,
};
