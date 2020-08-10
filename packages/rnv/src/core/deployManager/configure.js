import PlatformSetup from '../setupManager';
import { commandExistsSync } from '../systemManager/exec';
import { checkRequiredPackage } from '../configManager/packageParser';

export const configureDeploymentIfRequired = async (c, deploymentTarget) => {
    if (deploymentTarget === 'docker') {
        await checkRequiredPackage(c,
            '@rnv/deploy-docker',
            false,
            'devDependencies');
        if (!commandExistsSync('docker')) {
            const setupInstance = PlatformSetup();
            await setupInstance.askToInstallSDK('docker');
        }
    }
    if (deploymentTarget === 'aws') {
        await checkRequiredPackage(c, '@rnv/deploy-aws', false, 'devDependencies');
        if (!commandExistsSync('aws')) {
            const setupInstance = PlatformSetup();
            await setupInstance.askToInstallSDK('aws');
        }
    }
};

export const configureExportIfRequired = async (c, exportTarget) => {
    if (exportTarget === 'docker') {
        await checkRequiredPackage(c,
            '@rnv/deploy-docker',
            false,
            'devDependencies');
    }
};
