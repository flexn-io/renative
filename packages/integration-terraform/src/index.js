import taskRnvTerraformDeploy from './tasks/task.rnv.terraform.deploy';
import taskRnvTerraformDestroy from './tasks/task.rnv.terraform.destroy';
import taskRnvTerraformStatus from './tasks/task.rnv.terraform.status';
import config from '../renative.integration.json';

const TASKS = [taskRnvTerraformDeploy, taskRnvTerraformDestroy, taskRnvTerraformStatus];

const getTasks = () => TASKS;

export default {
    getTasks,
    config,
};
