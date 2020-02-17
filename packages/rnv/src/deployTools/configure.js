import Config from '../config';
import PlatformSetup from '../setupTools';
import { commandExistsSync } from '../systemTools/exec';


const configureDeploymentIfRequired = async (deploymentTarget) => {
    if (deploymentTarget === 'docker') {
        await Config.checkRequiredPackage('@rnv/deploy-docker', false, 'devDependencies');
        if (!commandExistsSync('docker')) {
            const setupInstance = PlatformSetup();
            await setupInstance.askToInstallSDK('docker');
        }
    }
    if (deploymentTarget === 'aws') {
        await Config.checkRequiredPackage('@rnv/deploy-aws', false, 'devDependencies');
        if (!commandExistsSync('aws')) {
            const setupInstance = PlatformSetup();
            await setupInstance.askToInstallSDK('aws');
        }
    }
};

const configureExportIfRequired = async (exportTarget) => {
    if (exportTarget === 'docker') {
        await Config.checkRequiredPackage('@rnv/deploy-docker', false, 'devDependencies');
    }
};

export { configureDeploymentIfRequired, configureExportIfRequired };
