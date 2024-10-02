import taskDockerDeploy from './tasks/taskDockerDeploy';
import taskDockerExport from './tasks/taskDockerExport';
import { Config } from './config';
import { createRnvModule } from '@rnv/core';

const Integration = createRnvModule({
    tasks: [taskDockerExport, taskDockerDeploy] as const,
    name: Config.integration.name,
    type: 'public',
});

export default Integration;
