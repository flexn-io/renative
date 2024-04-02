import taskStarterHello from './tasks/taskStarterHello';
import taskSingleCommand from './tasks/taskSingleCommand';
import { createRnvIntegration } from '@rnv/core';
import { Config } from './config';

const Integration = createRnvIntegration({
    tasks: [taskStarterHello, taskSingleCommand],
    config: Config,
});

export default Integration;
