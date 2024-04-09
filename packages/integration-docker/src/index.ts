import taskDockerDeploy from './tasks/taskDockerDeploy';
import taskDockerExport from './tasks/taskDockerExport';
import { Config } from './config';
import { createRnvModule } from '@rnv/core';

const Integration = createRnvModule({
    tasks: [taskDockerExport, taskDockerDeploy],
    name: Config.name,
    type: 'generic',
});

export default Integration;
