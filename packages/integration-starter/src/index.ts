import taskRnvStarterHello from './tasks/task.rnv.starter.hello';
//@ts-ignore
import config from '../renative.integration.json';

const TASKS = [taskRnvStarterHello];

const getTasks = () => TASKS;

export default {
    getTasks,
    config,
};
