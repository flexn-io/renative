import taskStarterHello from './tasks/taskStarterHello';
import taskSingleCommand from './tasks/taskSingleCommand';
import { Config } from './config';
import { createRnvModule } from '@rnv/core';

const Integration = createRnvModule({
    tasks: [taskStarterHello, taskSingleCommand],
    name: Config.name,
    type: 'generic',
});

export default Integration;
