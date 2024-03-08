import taskDockerDeploy from './tasks/taskDockerDeploy';
import taskDockerExport from './tasks/taskDockerExport';
//@ts-ignore
import config from '../renative.integration.json';
import { RnvIntegration } from '@rnv/core';

const TASKS = [taskDockerExport, taskDockerDeploy];

const getTasks = () => TASKS;

const Integration: RnvIntegration = {
    getTasks,
    config,
};

export default Integration;
