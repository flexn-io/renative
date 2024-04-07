import taskDockerDeploy from './tasks/taskDockerDeploy';
import taskDockerExport from './tasks/taskDockerExport';
import { createRnvIntegration } from '@rnv/core';
import { Config } from './config';

const Integration = createRnvIntegration({
    tasks: [taskDockerExport, taskDockerDeploy],
    config: Config,
});

export default Integration;
