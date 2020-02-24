/* eslint-disable global-require, import/no-dynamic-require */
import path from 'path';
import { CHROMECAST, WEB } from '../rnv/src/constants';

class Aws {
    setRNVPath(pth) {
        this.rnvPath = pth;
    }

    // async buildImage() {
    //     const { writeCleanFile, getConfigProp } = require(path.join(this.rnvPath, 'dist/common'));
    //     const { logTask, logInfo } = require(path.join(this.rnvPath, 'dist/systemTools/logger'));
    //     const config = require(path.join(this.rnvPath, 'dist/config')).default;
    //     const { executeAsync } = require(path.join(this.rnvPath, 'dist/systemTools/exec'));
    //     const { copyFolderRecursiveSync, cleanFolder } = require(path.join(this.rnvPath, 'dist/systemTools/fileutils'));

    //     const { paths, runtime, platform, files } = config.getConfig();
    //     const projectBuilds = paths.project.builds.dir;
    //     const projectBuildWeb = path.join(projectBuilds, `${runtime.appId}_${platform}`);
    //     const dockerDestination = path.join(projectBuildWeb, 'export', 'docker');

    //     const dockerFile = path.join(__dirname, '../Dockerfile');
    //     const nginxConfFile = path.join(__dirname, '../nginx/default.conf');
    //     const dockerComposeBuildFile = path.join(__dirname, '../docker-compose.build.yml');
    //     const dockerComposeFile = path.join(__dirname, '../docker-compose.yml');

    //     await cleanFolder(path.join(dockerDestination));
    //     copyFolderRecursiveSync(path.join(projectBuildWeb, 'public'), dockerDestination);

    //     const copiedDockerFile = path.join(dockerDestination, 'Dockerfile');
    //     const copiedNginxConfFile = path.join(dockerDestination, 'nginx.default.conf');
    //     const copiedDockerComposeBuildFile = path.join(dockerDestination, 'docker-compose.build.yml');
    //     const copiedDockerComposeFile = path.join(dockerDestination, 'docker-compose.yml');

    //     const imageName = runtime.appId.toLowerCase();
    //     const appVersion = files.project.package.version;

    //     // save the docker files
    //     logTask('docker:Dockerfile:create');
    //     const deployOptions = getConfigProp(config.getConfig(), platform, 'deploy');
    //     const healthCheck = deployOptions?.docker?.healthcheckProbe;

    //     let additionalCommands = '';

    //     if (healthCheck) {
    //         additionalCommands = 'RUN touch /var/www/localhost/htdocs/testprobe.html';
    //     }

    //     writeCleanFile(dockerFile, copiedDockerFile, [
    //         { pattern: '{{DOCKER_ADDITIONAL_COMMANDS}}', override: additionalCommands }
    //     ]);

    //     writeCleanFile(nginxConfFile, copiedNginxConfFile);
    //     writeCleanFile(dockerComposeBuildFile, copiedDockerComposeBuildFile);
    //     writeCleanFile(dockerComposeFile, copiedDockerComposeFile, [
    //         { pattern: '{{IMAGE_AND_TAG}}', override: `${imageName}:${appVersion}` },
    //     ]);

    //     logTask('docker:Dockerfile:build');
    //     await executeAsync(`docker build -t ${imageName}:${appVersion} ${dockerDestination}`);

    //     logInfo(`Your Dockerfile and docker-compose.yml are located in ${dockerDestination}`);
    // }

    // async saveImage() {
    //     const { getConfigProp } = require(path.join(this.rnvPath, 'dist/common'));
    //     const config = require(path.join(this.rnvPath, 'dist/config')).default;
    //     const { runtime, files, paths, platform, program: { scheme = 'debug' } } = config.getConfig();
    //     const { logTask, logInfo } = require(path.join(this.rnvPath, 'dist/systemTools/logger'));
    //     const { executeAsync, commandExistsSync } = require(path.join(this.rnvPath, 'dist/systemTools/exec'));
    //     const imageName = runtime.appId.toLowerCase();
    //     const appVersion = files.project.package.version;

    //     const projectBuilds = paths.project.builds.dir;
    //     const projectBuildWeb = path.join(projectBuilds, `${runtime.appId}_${platform}`);
    //     const dockerDestination = path.join(projectBuildWeb, 'export', 'docker');
    //     const dockerSaveFile = path.join(dockerDestination, `${imageName}_${appVersion}.tar`);

    //     logTask('docker:Dockerfile:build');
    //     await executeAsync(`docker save -o ${dockerSaveFile} ${imageName}:${appVersion}`);
    //     logInfo(`${imageName}_${appVersion}.tar file has been saved in ${dockerDestination}. You can import it on another machine by running 'docker load -i ${imageName}_${appVersion}.tar'`);

    //     const deployOptions = getConfigProp(config.getConfig(), platform, 'deploy');
    //     const zipImage = deployOptions?.docker?.zipImage;

    //     if (zipImage) {
    //         logTask('docker:zipImage');
    //         if (commandExistsSync('zip')) {
    //             const pth = `${dockerDestination}${path.sep}`;
    //             await executeAsync(`zip -j ${pth}web_${imageName}_${scheme}_${appVersion}.zip ${pth}${imageName}_${appVersion}.tar ${pth}docker-compose.yml`);
    //         }
    //     }
    // }

    // async doExport() {
    //     await this.buildImage();
    //     return this.saveImage();
    // }

    async doDeploy() {
        // rnv paths
        const config = require(_path.default.join(this.rnvPath, 'dist/config'))
            .default;

        const { inquirerPrompt } = require(_path.default.join(
            this.rnvPath,
            'dist/systemTools/prompt'
        ));

        const { logInfo, logTask } = require(_path.default.join(
            this.rnvPath,
            'dist/systemTools/logger'
        ));

        const { executeAsync } = require(_path.default.join(
            this.rnvPath,
            'dist/systemTools/exec'
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
