import path from 'path';
import fs from 'fs';

import Config from '../config';
import { writeCleanFile } from '../common';
import { executeAsync } from '../systemTools/exec';

export const rnvApiAdd = async () => {
    await Config.checkRequiredPackage('serverless', '1.67.0', 'devDependencies', false, true);
    await Config.checkRequiredPackage('serverless-webpack', '5.3.1', 'devDependencies', true, true);
    await Config.checkRequiredPackage('serverless-pseudo-parameters', '2.5.0', 'devDependencies', true, true);
    await Config.checkRequiredPackage('serverless-dotenv-plugin', '2.3.2', 'devDependencies', true, true);
    await Config.checkRequiredPackage('serverless-offline', '6.0.0', 'devDependencies', true, true);
    await Config.checkRequiredPackage('webpack-node-externals', '1.7.2', 'devDependencies', true);
    const { paths, buildConfig } = Config.getConfig();

    const slsPath = path.join(paths.project.dir, 'serverless.json');
    const webpackConfigPath = path.join(paths.project.dir, 'webpack.serverless.config.js');
    const apiDirPath = path.join(paths.project.dir, 'src/api');
    const defaultHandlerPath = path.join(apiDirPath, 'handler.js');

    if (!fs.existsSync(slsPath)) {
        writeCleanFile(path.join(paths.rnv.dir, 'src/backendTools/template/serverless.json'), slsPath, [
            { pattern: '{{PROJECT_NAME}}', override: buildConfig.id },
        ]);
    }

    if (!fs.existsSync(webpackConfigPath)) {
        writeCleanFile(path.join(paths.rnv.dir, 'src/backendTools/template/webpack.serverless.config.js'), webpackConfigPath);
    }

    if (!fs.existsSync(apiDirPath)) fs.mkdirSync(apiDirPath);
    if (!fs.existsSync(defaultHandlerPath)) {
        writeCleanFile(path.join(paths.rnv.dir, 'src/backendTools/template/handler.js'), defaultHandlerPath);
    }
};

export const rnvApiDeploy = () => executeAsync('npx serverless deploy', { interactive: true });

export const rnvApiOffline = () => executeAsync('npx serverless offline', { interactive: true });
