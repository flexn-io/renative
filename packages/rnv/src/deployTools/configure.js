import Config from '../config';
import { inquirerPrompt } from '../systemTools/prompt';
import PlatformSetup from '../setupTools';
import { commandExistsSync } from '../systemTools/exec';

const configureDeploymentIfRequired = async (deploymentTarget) => {
    const projectConfig = Config.getProjectConfig();

    if (deploymentTarget === 'docker') {
        if (!projectConfig.package.dependencies['@rnv/deploy-docker']) {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message: 'You do not have Docker deployment configured. Do you want to configure it now?'
            });

            if (confirm) {
                if (!commandExistsSync('docker')) {
                    const setupInstance = PlatformSetup();
                    await setupInstance.askToInstallSDK('docker');
                }

                await Config.injectProjectDependency('@rnv/deploy-docker', 'latest'); // @TODO TO BE CHANGED
            }
        }
    }
};

export { configureDeploymentIfRequired };
