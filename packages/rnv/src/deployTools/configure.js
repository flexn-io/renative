import Config from '../config';
import { inquirerPrompt } from '../systemTools/prompt';
import PlatformSetup from '../setupTools';
import { commandExistsSync } from '../systemTools/exec';

const configureDeploymentIfRequired = async (deploymentTarget) => {
    const projectConfig = Config.getProjectConfig();

    // inject the package if necessary
    if (['aws', 'docker'].includes(deploymentTarget)) {
        if (!projectConfig.package.dependencies[`rnv-deploy-${deploymentTarget}`]) {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message: 'You do not have Docker deployment configured. Do you want to configure it now?'
            });

            if (confirm) {
                // @TODO TO BE CHANGED TO 'latest' or `npm view package version` after package deployment
                await Config.injectProjectDependency(`rnv-deploy-${deploymentTarget}`, `./packages/rnv-deploy-${deploymentTarget}`);
            }
        }
    }

    // deal with prereqs
    if (deploymentTarget === 'docker' && !commandExistsSync('docker')) {
        const setupInstance = PlatformSetup();
        await setupInstance.askToInstallSDK('docker');
    }
};

export { configureDeploymentIfRequired };
