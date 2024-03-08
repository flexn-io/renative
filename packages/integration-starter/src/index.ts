import taskStarterHello from './tasks/taskStarterHello';
import taskSingleCommand from './tasks/taskSingleCommand';

//@ts-ignore
import config from '../renative.integration.json';
import { RnvIntegration } from '@rnv/core';

const Integration: RnvIntegration = {
    getTasks: () => [taskStarterHello, taskSingleCommand],
    config,
};

export default Integration;
