import taskRnvDockerDeploy from './tasks/taskDockerDeploy';
import taskRnvDockerExport from './tasks/taskDockerExport';
//@ts-ignore
import config from '../renative.integration.json';

const TASKS = [taskRnvDockerExport, taskRnvDockerDeploy];

const getTasks = () => TASKS;

export default {
    getTasks,
    config,
};
