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

export const taskRnvTerraformStatus = async (c: RnvContext) => {
    logTask('taskRnvTerraformStatus');

    // let's see if you're good to go
    _checkPrereqs(c);

    const backendFolder = path.resolve(c.paths.project.dir, 'backend');

    const jp: any = JSON.parse;
    const lines = (
        await executeAsync(c, 'terraform plan --json', {
            cwd: backendFolder,
        })
    )
        .split('\n')
        .map(jp);

    const changeSummary: any = lines.filter((line: any) => line.type === 'change_summary');

    if (!changeSummary) {
        return logError('Could not get change summary from terraform plan', true);
    }

    logSuccess(changeSummary['@message']);
};

export default {
    description: 'Check your terraform project for pending changes',
    fn: taskRnvTerraformStatus,
    task: 'terraform status',
    params: PARAMS.withBase(),
    platforms: [],
};
