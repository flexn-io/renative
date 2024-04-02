import taskDockerDeploy from './tasks/taskDockerDeploy';
import taskDockerExport from './tasks/taskDockerExport';
import { RnvIntegration, generateRnvTaskMap } from '@rnv/core';
import { Config } from './config';

const Integration: RnvIntegration = {
    tasks: generateRnvTaskMap([taskDockerExport, taskDockerDeploy], Config),
    config: Config,
};

export default Integration;
