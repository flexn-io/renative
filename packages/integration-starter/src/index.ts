import taskStarterHello from './tasks/taskStarterHello';
//@ts-ignore
import config from '../renative.integration.json';

const TASKS = [taskStarterHello];

const getTasks = () => TASKS;

export default {
    getTasks,
    config,
};
