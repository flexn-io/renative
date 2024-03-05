import path from 'path';
import {
    RnvContext,
    inquirerPrompt,
    logDefault,
    logInfo,
    logSuccess,
    executeAsync,
    commandExistsSync,
    getConfigProp,
    copyFolderRecursiveSync,
    cleanFolder,
    writeCleanFile,
    fsExistsSync,
    chalk,
    ExecOptionsPresets,
    getAppFolder,
} from '@rnv/core';

const rootPath = path.join(__dirname, './');

class Docker {
    c: RnvContext;
    constructor(c: RnvContext) {
        this.c = c;
    }

    async buildImage() {
        const { c } = this;
        const { runtime, platform, files } = c;
        let outputDir = 'output';
        let projectBuildWeb = path.join(getAppFolder(c)!, outputDir);
        if (!fsExistsSync(projectBuildWeb)) {
            outputDir = 'project';
            projectBuildWeb = path.join(getAppFolder(c)!, outputDir);
        }
        const dockerDestination = path.join(getAppFolder(c)!, 'export', 'docker');

        const dockerFile = path.join(rootPath, '../Dockerfile');
        const nginxConfFile = path.join(rootPath, '../nginx/default.conf');
        const dockerComposeBuildFile = path.join(rootPath, '../docker-compose.build.yml');
        const dockerComposeFile = path.join(rootPath, '../docker-compose.yml');

        await cleanFolder(path.join(dockerDestination));
        copyFolderRecursiveSync(projectBuildWeb, dockerDestination);

        const copiedDockerFile = path.join(dockerDestination, 'Dockerfile');
        const copiedNginxConfFile = path.join(dockerDestination, 'nginx.default.conf');
        const copiedDockerComposeBuildFile = path.join(dockerDestination, 'docker-compose.build.yml');
        const copiedDockerComposeFile = path.join(dockerDestination, 'docker-compose.yml');

        const imageName = runtime.appId?.toLowerCase();
        const appVersion = files.project.package.version;

        // save the docker files
        logDefault('docker:Dockerfile:create');
        const deployOptions = getConfigProp(c, platform, 'custom').deploy;
        const healthCheck = deployOptions?.docker?.healthcheckProbe;

        let additionalCommands = '';

        if (healthCheck) {
            additionalCommands = 'RUN touch /var/www/localhost/htdocs/testprobe.html';
        }

        writeCleanFile(dockerFile, copiedDockerFile, [
            { pattern: '{{BUILD_FOLDER}}', override: outputDir },
            { pattern: '{{DOCKER_ADDITIONAL_COMMANDS}}', override: additionalCommands },
        ]);

        writeCleanFile(nginxConfFile, copiedNginxConfFile);
        writeCleanFile(dockerComposeBuildFile, copiedDockerComposeBuildFile);
        writeCleanFile(dockerComposeFile, copiedDockerComposeFile, [
            { pattern: '{{IMAGE_AND_TAG}}', override: `${imageName}:${appVersion}` },
        ]);

        logDefault('docker:Dockerfile:build');
        await executeAsync(`docker build -t ${imageName}:${appVersion} ${dockerDestination}`);

        logInfo(`Your Dockerfile and docker-compose.yml are located in ${dockerDestination}`);
    }

    async saveImage() {
        const { c } = this;
        const {
            runtime,
            files,
            platform,
            program: { scheme = 'debug' },
        } = c;

        const imageName = runtime.appId?.toLowerCase();
        const appVersion = files.project.package.version;

        const dockerDestination = path.join(getAppFolder(c)!, 'export', 'docker');
        const dockerSaveFile = path.join(dockerDestination, `${imageName}_${appVersion}.tar`);

        logDefault('docker:Dockerfile:build');
        await executeAsync(`docker save -o ${dockerSaveFile} ${imageName}:${appVersion}`);
        logSuccess(
            `${imageName}_${appVersion}.tar file has been saved in ${chalk().bold(
                dockerDestination
            )}. You can import it on another machine by running ${chalk().bold(
                `'docker load -i ${imageName}_${appVersion}.tar'`
            )}`
        );
        logSuccess(
            `You can also test it locally by running the following command: ${chalk().bold(
                `'docker run -d --rm -p 8081:80 -p 8443:443 ${imageName}:${appVersion}'`
            )} and then opening ${chalk().bold('http://localhost:8081')}`
        );

        const deployOptions = getConfigProp(c, platform, 'custom').deploy;
        const zipImage = deployOptions?.docker?.zipImage;

        if (zipImage) {
            logDefault('docker:zipImage');
            if (commandExistsSync('zip')) {
                const pth = `${dockerDestination}${path.sep}`;
                await executeAsync(
                    `zip -j ${pth}web_${imageName}_${scheme}_${appVersion}.zip ${pth}${imageName}_${appVersion}.tar ${pth}docker-compose.yml`
                );
            }
        }
    }

    async doExport() {
        await this.buildImage();
        return this.saveImage();
    }

    async doDeploy() {
        const { c } = this;
        const { runtime, files } = c;

        await this.buildImage();

        let { DOCKERHUB_USER, DOCKERHUB_PASS } = process.env;

        // ask for user/pass if not present in env
        if (!DOCKERHUB_PASS || !DOCKERHUB_USER) {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message:
                    "It seems you don't have the DOCKERHUB_USER and DOCKERHUB_PASS environment variables set. Do you want to enter them here?",
            });

            if (confirm) {
                const { user } = await inquirerPrompt({
                    name: 'user',
                    type: 'input',
                    message: 'DockerHub username',
                    validate: (i) => !!i || 'No username provided',
                });
                DOCKERHUB_USER = user;
                const { pass } = await inquirerPrompt({
                    name: 'pass',
                    type: 'password',
                    message: 'DockerHub password',
                    validate: (i) => !!i || 'No password provided',
                });
                DOCKERHUB_PASS = pass;
            } else {
                return logInfo(
                    'You chose to not publish the image on DockerHub. The Dockerfile is located in the root folder'
                );
            }
        }

        const imageName = runtime.appId?.toLowerCase();
        const imageTag = `${DOCKERHUB_USER}/${imageName}`;
        const appVersion = files.project.package.version;

        logDefault('docker:Dockerfile:login');
        await executeAsync(
            `echo "${DOCKERHUB_PASS}" | docker login -u "${DOCKERHUB_USER}" --password-stdin`,
            ExecOptionsPresets.INHERIT_OUTPUT_NO_SPINNER
        );
        logDefault('docker:Dockerfile:push');
        // tagging for versioning
        await executeAsync(`docker tag ${imageName}:${appVersion} ${imageTag}:${appVersion}`);
        await executeAsync(`docker tag ${imageName}:${appVersion} ${imageTag}:latest`);
        await executeAsync(`docker push ${imageTag}:${appVersion}`);
        await executeAsync(`docker push ${imageTag}:latest`);
        return true;
    }
}

export default Docker;
