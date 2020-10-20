/* eslint-disable global-require, import/no-dynamic-require */
import path from 'path';

const { DOCKERHUB_USER, DOCKERHUB_PASS } = process.env;

class Aws {
    setRNVPath(pth) {
        this.RNV = require(path.join(pth, 'dist'));
    }

    async doDeploy() {
        const { Config, Constants, Prompt, Logger, Exec } = this.RNV;
        const { CHROMECAST, WEB } = Constants;
        const { inquirerPrompt } = Prompt;
        const { executeAsync } = Exec;
        const { logTask } = Logger;
        const c = Config.getConfig();
        const { runtime, files, platform } = c;


        await inquirerPrompt({
            name: 'client',
            type: 'input',
            message: 'The client name (will be used as subdomain)'
        });
        await inquirerPrompt({
            name: 'env',
            type: 'list',
            choices: [{ name: 'staging' }, { name: 'production' }]
        });

        switch (platform) {
            case CHROMECAST:
                break;
            case WEB:
                break;
            default:
                throw new Error(
                    `AWS deployment does not support platform: ${platform}`
                );
        }

        const imageName = runtime.appId.toLowerCase();
        const imageTag = `${DOCKERHUB_USER}/${imageName}`;
        const appVersion = files.project.package.version;

        logTask('docker:Dockerfile:login');
        await executeAsync(
            `echo "${DOCKERHUB_PASS}" | docker login -u "${DOCKERHUB_USER}" --password-stdin`,
            { interactive: true }
        );
        logTask('docker:Dockerfile:push');
        // tagging for versioning
        await executeAsync(
            `docker tag ${imageName}:${appVersion} ${imageTag}:${appVersion}`
        );
        await executeAsync(
            `docker tag ${imageName}:${appVersion} ${imageTag}:latest`
        );
        await executeAsync(`docker push ${imageTag}:${appVersion}`);
        await executeAsync(`docker push ${imageTag}:latest`);
        return true;
    }
}

export default new Aws();
