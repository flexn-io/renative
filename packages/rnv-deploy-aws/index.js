/* eslint-disable global-require, import/no-dynamic-require */
import _path from 'path';

const { CHROMECAST, WEB } = require(_path.default.join(this.rnvPath, 'dist/core/constants')).default;
const { DOCKERHUB_USER, DOCKERHUB_PASS } = process.env;


class Aws {
    setRNVPath(pth) {
        this.rnvPath = pth;
    }

    async doDeploy() {
        // rnv paths
        const config = require(_path.default.join(this.rnvPath, 'dist/core/config')).default;

        const { inquirerPrompt } = require(_path.default.join(
            this.rnvPath,
            'dist/core/systemManager/prompt'
        ));

        const { logTask } = require(_path.default.join(
            this.rnvPath,
            'dist/core/systemManager/logger'
        ));

        const { executeAsync } = require(_path.default.join(
            this.rnvPath,
            'dist/core/systemManager/exec'
        ));

        const { runtime, files } = config.getConfig();

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
