import path from 'path';
import lSet from 'lodash/set';
import lGet from 'lodash/get';
import {
    RnvContext,
    fsExistsSync,
    writeFileSync,
    fsReadFileSync,
    fsWriteFileSync,
    executeAsync,
    logInfo,
    logTask,
    logSuccess,
    PARAMS,
} from '@rnv/core';
import { _checkPrereqs } from './task.rnv.terraform.status';


export const taskRnvTerraformDeploy = async (c: RnvContext) => {
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

    if (c.buildConfig.custom.backendServiceConfig) {
        logInfo('Config found, copying to backend');
        fsWriteFileSync(
            path.join(backendFolder, 'config.auto.tfvars.json'),
            JSON.stringify(c.buildConfig.custom.backendServiceConfig, null, 2)
        );
    }

    await executeAsync(c, 'terraform apply -auto-approve', {
        cwd: backendFolder,
    });

    logInfo('Terraform deployment complete');

    const tfStateFile = JSON.parse(fsReadFileSync(tfStateFilePath).toString());

    c.buildConfig.custom.requiredBackendOutputs?.forEach(
        (output: { fromKey: string; toFile: string; toKey: string }) => {
            const value = lGet(tfStateFile, output.fromKey);
            const targetFile = path.join(c.paths.project.dir, output.toFile);
            const targetFileContent = fsReadFileSync(targetFile).toString();
            const targetFileContentJson = JSON.parse(targetFileContent);
            lSet(targetFileContentJson, output.toKey, value);
            writeFileSync(targetFile, targetFileContentJson);
        }
    );

    logSuccess('Backend service runtime config updated');
};

export default {
    description: 'Deploys your terraform project',
    fn: taskRnvTerraformDeploy,
    task: 'terraform deploy',
    params: PARAMS.withBase(),
    platforms: [],
};
