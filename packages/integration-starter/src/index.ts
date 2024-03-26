import taskStarterHello from './tasks/taskStarterHello';
import taskSingleCommand from './tasks/taskSingleCommand';
//@ts-ignore
import CNF from '../renative.integration.json';
//@ts-ignore
import PKG from '../package.json';
import { RnvIntegration, generateRnvTaskMap } from '@rnv/core';

const Integration: RnvIntegration = {
    tasks: generateRnvTaskMap([taskStarterHello, taskSingleCommand], PKG),
    config: CNF,
};

export default Integration;
