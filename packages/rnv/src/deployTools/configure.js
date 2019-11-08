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
};

const configureExportIfRequired = async (exportTarget) => {
    if (exportTarget === 'docker') {
        await Config.checkRequiredPackage('@rnv/deploy-docker', false, 'devDependencies');
    }
};

export { configureDeploymentIfRequired, configureExportIfRequired };
