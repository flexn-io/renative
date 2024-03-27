import taskDockerDeploy from './tasks/taskDockerDeploy';
import taskDockerExport from './tasks/taskDockerExport';
import { RnvIntegration, generateRnvTaskMap } from '@rnv/core';
//@ts-ignore
import CNF from '../renative.integration.json';
//@ts-ignore
import PKG from '../package.json';

const Integration: RnvIntegration = {
    tasks: generateRnvTaskMap([taskDockerExport, taskDockerDeploy], PKG),
    config: CNF,
};

export default Integration;
