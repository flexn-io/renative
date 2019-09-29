import { getConfigProp } from 'rnv/dist/common';
import config from 'rnv/dist/config';
import path from 'path';
import AWSSDK from 'aws-sdk';
import { inquirerPrompt } from 'rnv/dist/systemTools/prompt';
import { logInfo, logTask } from 'rnv/dist/systemTools/logger';
import { executeAsync } from 'rnv/dist/systemTools/exec';

const deployVersion = () => {

};

const deployToAWS = async () => {
    const { paths, runtime, platform, program: { scheme } } = config.getConfig();
    const basePath = `${paths.project.builds.dir}/${runtime.appId}_${platform}`;
    const deployPath = `${basePath}/public`;
    const { appName } = getConfigProp(config.getConfig(), platform, 'deploy');
    const urlPure = `http://${appName}.nxg.staging.24imedia.com/${platform}-${scheme}-${v}/index.html`;
    const url = chalk.white(urlPure);

    const { aws_secret_access_key, aws_access_key_id } = process.env;


    deployVersion(`staging -c nxg -a ${appName} -n ${platform}-${scheme}-${v} -d ${deployPath}`);
    if (aws_access_key_id && aws_secret_access_key) {
        params += ` -s ${aws_access_key_id} -k ${aws_secret_access_key}`;
    }
    console.log('deployed', url);
};

const doDeploy = async () => {
    const { paths, runtime, platform, files } = config.getConfig();
    const projectBuilds = paths.project.builds.dir;
    const projectBuildWeb = path.join(projectBuilds, `${runtime.appId}_${platform}`);
    const { DOCKERHUB_USER, DOCKERHUB_PASS } = process.env;

    const version = `v${files.project.package.version}`;
    const title = getConfigProp(config.getConfig(), platform, 'title');
    return deployToAWS(version)
        .then(deployToAWS('latest'))
        .then((v) => {
            const msg = `Just deployed NXG-SDK-UI *${title}* (*${platform}*) *${version}* to ${v}`;
            return notifySlack(msg);
        });
};

export default doDeploy;
