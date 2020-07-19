/* eslint-disable global-require, import/no-dynamic-require */
import path from 'path';
import { Constants: {CHROMECAST, WEB} } from 'rnv';

class Aws {
    setRNVPath(pth) {
        this.rnvPath = pth;
    }

    async doDeploy() {
        // rnv paths
        const config = require(_path.default.join(this.rnvPath, 'dist/config'))
            .default;

        const { inquirerPrompt } = require(_path.default.join(
            this.rnvPath,
            'dist/core/systemManager/prompt'
        ));

        const { logInfo, logTask } = require(_path.default.join(
            this.rnvPath,
            'dist/core/systemManager/logger'
        ));

        const { executeAsync } = require(_path.default.join(
            this.rnvPath,
            'dist/core/systemManager/exec'
        ));

        const { runtime, files } = config.getConfig();

        const { subdomain } = await inquirerPrompt({
            name: 'client',
            type: 'input',
            message: 'The client name (will be used as subdomain)'
        });
        const { env } = await inquirerPrompt({
            name: 'env',
            type: 'list',
            choices: [{ name: 'staging' }, { name: 'production' }]
        });

        const { platform } = config.getConfig();

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
