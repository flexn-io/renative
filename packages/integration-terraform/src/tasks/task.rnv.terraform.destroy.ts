import path from 'path';

import { Logger, Constants, FileUtils, Exec, RnvContext } from 'rnv';

const { fsExistsSync } = FileUtils;
const { executeAsync, commandExistsSync } = Exec;
const { logSuccess, logTask, logError } = Logger;

const { PARAMS } = Constants;

const _checkPrereqs = (c: RnvContext) => {
    const backendFolder = path.resolve(c.paths.project.dir, 'backend');

    if (!fsExistsSync(backendFolder)) {
        logError('No backend folder found.', true);
    }

    if (!commandExistsSync('terraform')) {
        logError(
            'Terraform not found. Please install it then continue (https://learn.hashicorp.com/tutorials/terraform/install-cli)',
            true
        );
    }
};

export const taskRnvTerraformDestroy = async (c: RnvContext) => {
    logTask('taskRnvTerraformDestroy');

    // let's see if you're good to go
    _checkPrereqs(c);

    const backendFolder = path.resolve(c.paths.project.dir, 'backend');

    await executeAsync(c, 'terraform destroy -auto-approve', {
        cwd: backendFolder,
    });

    logSuccess('Terraform destroy complete');
};

export default {
    description: 'Deletes your terraform project',
    fn: taskRnvTerraformDestroy,
    task: 'terraform destroy',
    params: PARAMS.withBase(),
    platforms: [],
};
