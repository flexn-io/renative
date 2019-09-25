import { writeCleanFile } from 'rnv/dist/common';
import config from 'rnv/dist/config';
import path from 'path';
import { inquirerPrompt } from 'rnv/dist/systemTools/prompt';
import { logInfo, logTask } from 'rnv/dist/systemTools/logger';
import { executeAsync } from 'rnv/dist/systemTools/exec';

const doDeploy = async () => {
    const { paths, runtime, platform, files } = config.getConfig();
    const projectBuilds = paths.project.builds.dir;
    const projectBuildWeb = path.join(projectBuilds, `${runtime.appId}_${platform}`);
    const dockerFile = path.join(__dirname, '../Dockerfile');
    const nginxConfFile = path.join(__dirname, '../nginx/default.conf');
    const copiedDockerFile = path.join(projectBuildWeb, 'Dockerfile');
    const copiedNginxConfFile = path.join(projectBuildWeb, 'nginx.default.conf');
    let { DOCKERHUB_USER, DOCKERHUB_PASS } = process.env;

    // save the Dockerfile
    logTask('docker:Dockerfile:create');
    writeCleanFile(dockerFile, copiedDockerFile);
    writeCleanFile(nginxConfFile, copiedNginxConfFile);

    // ask for user/pass if not present in env
    if (!DOCKERHUB_PASS || !DOCKERHUB_USER) {
        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: 'It seems you don\'t have the DOCKERHUB_USER and DOCKERHUB_PASS environment variables set. Do you want to enter them here?'
        });

        if (confirm) {
            const { user } = await inquirerPrompt({
                name: 'user',
                type: 'input',
                message: 'DockerHub username',
                validate: i => !!i || 'No username provided'
            });
            DOCKERHUB_USER = user;
            const { pass } = await inquirerPrompt({
                name: 'pass',
                type: 'password',
                message: 'DockerHub password',
                validate: i => !!i || 'No password provided'
            });
            DOCKERHUB_PASS = pass;
        } else {
            return logInfo('You chose to not publish the image on DockerHub. The Dockerfile is located in the root folder');
        }
    }

    const imageName = runtime.appId.toLowerCase();
    const imageTag = `${DOCKERHUB_USER}/${imageName}`;
    const appVersion = files.project.package.version;

    logTask('docker:Dockerfile:build');
    await executeAsync(`docker build -t ${imageTag}:latest ${projectBuildWeb}`);
    logTask('docker:Dockerfile:login');
    await executeAsync(`echo "${DOCKERHUB_PASS}" | docker login -u "${DOCKERHUB_USER}" --password-stdin`, { interactive: true });
    logTask('docker:Dockerfile:push');
    // tagging for versioning
    await executeAsync(`docker tag ${imageTag}:latest ${imageTag}:${appVersion}`);
    await executeAsync(`docker push ${imageTag}:${appVersion}`);
    await executeAsync(`docker push ${imageTag}:latest`);
};

export default doDeploy;
