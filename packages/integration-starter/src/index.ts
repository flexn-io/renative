import taskStarterHello from './tasks/taskStarterHello';
//@ts-ignore
import config from '../renative.integration.json';
import { RnvIntegration } from '@rnv/core';

const TASKS = [taskStarterHello];

const getTasks = () => TASKS;

const Integration: RnvIntegration = {
    getTasks,
    config,
};

export default Integration;
