import taskStarterHello from './tasks/taskStarterHello';
import taskSingleCommand from './tasks/taskSingleCommand';
import { RnvIntegration, generateRnvTaskMap } from '@rnv/core';
import { Config } from './config';

const Integration: RnvIntegration = {
    tasks: generateRnvTaskMap([taskStarterHello, taskSingleCommand], Config),
    config: Config,
};

export default Integration;
