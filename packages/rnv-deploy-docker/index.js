/* eslint-disable global-require, import/no-dynamic-require */
import path from 'path';
import { getInstalledPath } from 'get-installed-path';

const doExport = async () => {
    const rnvPath = await getInstalledPath('rnv', { local: false });
    const { writeCleanFile } = require(path.join(rnvPath, 'dist/common'));
    const { logTask, logInfo } = require(path.join(rnvPath, 'dist/systemTools/logger'));
    const config = require(path.join(rnvPath, 'dist/config')).default;

    const { paths, runtime, platform } = config.getConfig();
    const projectBuilds = paths.project.builds.dir;
    const projectBuildWeb = path.join(projectBuilds, `${runtime.appId}_${platform}`);

    const dockerFile = path.join(__dirname, '../Dockerfile');
    const nginxConfFile = path.join(__dirname, '../nginx/default.conf');
    const dockerComposeFile = path.join(__dirname, '../docker-compose.yml');
    const copiedDockerFile = path.join(projectBuildWeb, 'Dockerfile');
    const copiedNginxConfFile = path.join(projectBuildWeb, 'nginx.default.conf');
    const copiedDockerComposeFile = path.join(projectBuildWeb, 'docker-compose.yml');
    // save the docker files
    logTask('docker:Dockerfile:create');
    writeCleanFile(dockerFile, copiedDockerFile);
    writeCleanFile(nginxConfFile, copiedNginxConfFile);
    writeCleanFile(dockerComposeFile, copiedDockerComposeFile);
    logInfo(`Your Dockerfile and docker-compose.yml are located in ${projectBuildWeb}`);
};

const doDeploy = async () => {
    // rnv paths
    const rnvPath = await getInstalledPath('rnv', { local: false });
    const config = require(path.join(rnvPath, 'dist/config')).default;
    const { inquirerPrompt } = require(path.join(rnvPath, 'dist/systemTools/prompt'));
    const { logInfo, logTask } = require(path.join(rnvPath, 'dist/systemTools/logger'));
    const { executeAsync } = require(path.join(rnvPath, 'dist/systemTools/exec'));

    const { paths, runtime, platform, files } = config.getConfig();
    const projectBuilds = paths.project.builds.dir;
    const projectBuildWeb = path.join(projectBuilds, `${runtime.appId}_${platform}`);

    await doExport();

    let { DOCKERHUB_USER, DOCKERHUB_PASS } = process.env;

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

export { doDeploy, doExport };
