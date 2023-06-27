import taskRnvVercelDeploy from './tasks/task.rnv.ftp.deploy';
import config from '../renative.integration.json';

const TASKS = [taskRnvVercelDeploy];

const getTasks = () => TASKS;

export default {
    getTasks,
    config,
};
