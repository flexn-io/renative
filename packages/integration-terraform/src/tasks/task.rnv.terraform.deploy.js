import path from 'path';
import lSet from 'lodash/set';
import lGet from 'lodash/get';

import { Logger, Constants, FileUtils, Exec } from 'rnv';

const { fsExistsSync, writeFileSync, fsReadFileSync, fsWriteFileSync } = FileUtils;
const { executeAsync, commandExistsSync } = Exec;
const { logInfo, logTask, logError, logSuccess } = Logger;

const { PARAMS } = Constants;

const _checkPrereqs = (c) => {
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

    if (!c.buildConfig.runtime?.backendServiceEnabled) {
        logError(
            'Backend service is not enabled, nothing to do here. Change renative.json runtime.backendServiceEnabled = true to get started',
            true
        );
    }
};

export const taskRnvTerraformDeploy = async (c) => {
    logTask('taskRnvTerraformDeploy');

    // let's see if you're good to go
    _checkPrereqs(c);

    const backendFolder = path.resolve(c.paths.project.dir, 'backend');
    const tfStateFilePath = path.join(backendFolder, 'terraform.tfstate');

    if (fsExistsSync(tfStateFilePath)) {
        logInfo('Terraform state file found. Skipping terraform init');
    } else {
        logInfo('No terraform state file found. Initializing terraform');
        await executeAsync(c, 'terraform init', { cwd: backendFolder });
        logInfo('Terraform init complete');
    }

    if (c.buildConfig.backendServiceConfig) {
        logInfo('Config found, copying to backend');
        fsWriteFileSync(
            path.join(backendFolder, 'config.auto.tfvars.json'),
            JSON.stringify(c.buildConfig.backendServiceConfig, null, 2)
        );
    }

    await executeAsync(c, 'terraform apply -auto-approve', {
        cwd: backendFolder,
    });

    logInfo('Terraform deployment complete');

    const tfStateFile = JSON.parse(FileUtils.fsReadFileSync(tfStateFilePath));

    c.buildConfig.requiredBackendOutputs?.forEach((output) => {
        const value = lGet(tfStateFile, output.fromKey);
        const targetFile = path.join(c.paths.project.dir, output.toFile);
        const targetFileContent = fsReadFileSync(targetFile);
        const targetFileContentJson = JSON.parse(targetFileContent);
        lSet(targetFileContentJson, output.toKey, value);
        writeFileSync(targetFile, targetFileContentJson);
    });

    logSuccess('Backend service runtime config updated');
};

export default {
    description: 'Deploys your terraform project',
    fn: taskRnvTerraformDeploy,
    task: 'terraform deploy',
    params: PARAMS.withBase(),
    platforms: [],
};
