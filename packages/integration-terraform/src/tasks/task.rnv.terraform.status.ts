import path from 'path';
import {
    RnvContext,
    fsExistsSync,
    executeAsync,
    commandExistsSync,
    logSuccess,
    logTask,
    logError,
    logInfo,
    PARAMS,
    fsWriteFileSync
} from '@rnv/core';

export const _checkPrereqs = async (c: RnvContext) => {
    const backendFolder = path.resolve(c.paths.project.dir, 'backend');

    if (!c.buildConfig.custom?.backendServiceEnabled) {
        logError(
            'Backend service is not enabled, nothing to do here. Change renative.json custom.backendServiceEnabled = true to get started',
            true
        );
    }

    if (!fsExistsSync(backendFolder)) {
        logError('No backend folder found.', true);
    }

    if (!commandExistsSync('terraform')) {
        logError(
            'Terraform not found. Please install it then continue (https://learn.hashicorp.com/tutorials/terraform/install-cli)',
            true
        );
    }

    if (!commandExistsSync('aws')) {
        logError(
            'AWS CLI not found. Please install it then continue (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)',
            true
        );
    }

    if (!fsExistsSync(path.resolve(backendFolder, '.terraform'))) {
        logInfo('Initializing terraform backend');
        await executeAsync(c, 'terraform init', {
            cwd: backendFolder,
        });
    }

    if (c.buildConfig.custom.backendServiceConfig) {
        logInfo('Config found, copying to backend');
        fsWriteFileSync(
            path.join(backendFolder, 'config.auto.tfvars.json'),
            JSON.stringify(c.buildConfig.custom.backendServiceConfig, null, 2)
        );
    }
};

export const taskRnvTerraformStatus = async (c: RnvContext) => {
    logTask('taskRnvTerraformStatus');

    // let's see if you're good to go
    await _checkPrereqs(c);

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
