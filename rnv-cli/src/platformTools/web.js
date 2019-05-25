import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';
import open from 'open';
import { execShellAsync } from '../exec';
import {
    isPlatformSupportedSync,
    getConfig,
    logTask,
    logComplete,
    logError,
    getAppFolder,
    isPlatformActive,
    checkSdk,
    logWarning,
    configureIfRequired,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBBOS_ARES_INSTALL,
    CLI_WEBBOS_ARES_LAUNCH,
    copyBuildsFolder,
    getAppTemplateFolder,
    checkPortInUse,
    logInfo,
    askQuestion,
    finishQuestion,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';
import { RNV_APP_CONFIG_NAME } from '../constants';

const { fork } = require('child_process');

function buildWeb(c, platform) {
    logTask(`buildWeb:${platform}`);

    const wbp = path.resolve(c.nodeModulesFolder, 'webpack/bin/webpack.js');

    return execShellAsync(`npx cross-env NODE_ENV=production node ${wbp} -p --config ./platformBuilds/${c.appId}_${platform}/webpack.config.js`);
}

const configureWebProject = (c, platform) =>
    new Promise((resolve, reject) => {
        logTask(`configureWebOSProject:${platform}`);

        if (!isPlatformActive(c, platform, resolve)) return;

        // configureIfRequired(c, platform)
        //     .then(() => configureProject(c, platform))
        copyBuildsFolder(c, platform)
            .then(() => configureProject(c, platform))
            .then(() => resolve())
            .catch(e => reject(e));
    });

const configureProject = (c, platform, appFolderName) =>
    new Promise((resolve, reject) => {
        logTask(`configureProject:${platform}`);

        resolve();
    });

const runWeb = (c, platform, port) =>
    new Promise((resolve, reject) => {
        logTask(`runWeb:${platform}:${port}`);

        checkPortInUse(c, platform, port)
            .then(isPortActive => {
                if (!isPortActive) {
                    logInfo(
                        `Looks like your ${chalk.white(platform)} devServer at port ${chalk.white(
                            port
                        )} is not running. Starting it up for you...`
                    );
                    _runWebBrowser(c, platform, port, 500)
                        .then(() => runWebDevServer(c, platform, port))
                        .then(() => resolve())
                        .catch(e => reject(e));
                } else {
                    logInfo(
                        `Looks like your ${chalk.white(platform)} devServer at port ${chalk.white(
                            port
                        )} is already running. ReNativeWill use it!`
                    );
                    _runWebBrowser(c, platform, port)
                        .then(() => resolve())
                        .catch(e => reject(e));
                }
            })
            .catch(e => reject(e));
    });

const _runWebBrowser = (c, platform, port, delay = 0) =>
    new Promise((resolve, reject) => {
        // if (delay) {
        //         const process = fork(path.join(c.nodeModulesFolder, 'open', 'index.js'));
        //         process.send(`http://0.0.0.0:${port}`);
        // } else {
        //     open(`http://0.0.0.0:${port}`);
        // }
        open(`http://0.0.0.0:${port}`);
        resolve();
    });

const runWebDevServer = (c, platform, port) =>
    new Promise((resolve, reject) => {
        logTask(`runWebDevServer:${platform}`);

        const appFolder = getAppFolder(c, platform);
        const templateFolder = getAppTemplateFolder(c, platform);
        const wpConfig = path.join(appFolder, 'webpack.config.js');
        const wpPublic = path.join(appFolder, 'public');

        copyFileSync(
            path.join(templateFolder, '_privateConfig', 'webpack.config.dev.js'),
            path.join(appFolder, 'webpack.config.js')
        );

        const wds = path.resolve(c.nodeModulesFolder, 'webpack-dev-server/bin/webpack-dev-server.js');

        shell.exec(
            `node ${wds} -d --devtool source-map --config ${wpConfig}  --inline --hot --colors --content-base ${wpPublic} --history-api-fallback --host 0.0.0.0 --port ${port}`
        );
        resolve();
    });

// DEPLOY
const DEPLOY_TARGETS = {
    FTP: 'ftp',
};

const _createDeployConfig = (c, platform) =>
    new Promise((resolve, reject) => {
        logTask(`_createDeployConfig:${platform}`);
        askQuestion(`Which type of deploy would you like for ${platform}:\n${Object.values(DEPLOY_TARGETS)
            .map((t, i) => `-[${i}] ${chalk.white(t)}\n`)}`)
            .then((v) => {
                finishQuestion();
                let selectedDeployTarget;
                if (isNaN(v)) {
                    selectedDeployTarget = Object.values(DEPLOY_TARGETS).indexOf(v) ? v : null;
                } else {
                    selectedDeployTarget = Object.values(DEPLOY_TARGETS)[v];
                }
                if (selectedDeployTarget) {
                    const configFilePath = path.resolve(c.projectConfig.appConfigsFolder, c.defaultAppConfigId, RNV_APP_CONFIG_NAME);
                    c.appConfigFile.platforms[platform].deploy = c.appConfigFile.platforms[platform].deploy || {};
                    c.appConfigFile.platforms[platform].deploy.type = selectedDeployTarget;
                    // We can store here more data (ftp credentials and so on),
                    // but as appConfigs is synced in the repo by default,
                    // we will use the more standarized .env way
                    const targetConfigPromise = selectedDeployTarget === DEPLOY_TARGETS.FTP 
                        ? new Promise((resolve, reject) => {
                            c.appConfigFile.platforms[platform].deploy.localRoot = path.resolve(c.platformBuildsFolder, `${c.appId}_${platform}`);
                            askQuestion(`Folder on the ftp to upload the project (default is '/')`)
                                .then((v) => {
                                    finishQuestion();
                                    c.appConfigFile.platforms[platform].deploy.remoteRoot = v || '/';
                                })
                                .then(() => {
                                    return askQuestion(`Delete all contents of that folder when deploying versions y/N (default is 'N')?`)
                                        .then((v) => {
                                            finishQuestion();
                                            c.appConfigFile.platforms[platform].deploy.deleteRemote = ['yes', 'Y', 'y'].indexOf(v) > -1 ? true : false;
                                        });
                                })
                                .then(() => {
                                    return askQuestion(`Included files pattern, comma separated (default '*','**/*' = all except dot files)`)
                                        .then((v) => {
                                            finishQuestion();
                                            c.appConfigFile.platforms[platform].deploy.include = v ? v.split(',') : ['*', '**/*'];
                                        });
                                })
                                .then(() => {
                                    c.appConfigFile.platforms[platform].deploy.exclude = [];
                                    return askQuestion(`Excluded files pattern, comma separated (default [])`)
                                        .then((v) => {
                                            finishQuestion();
                                            c.appConfigFile.platforms[platform].deploy.exclude = v ? v.split(',') : [];
                                        });
                                })
                                .then(() => {
                                    return askQuestion(`Exclude sourcemaps? y/N (default = N)`)
                                        .then((v) => {
                                            finishQuestion();
                                            c.appConfigFile.platforms[platform].deploy.exclude = c.appConfigFile.platforms[platform].deploy.exclude.concat(['yes', 'Y', 'y'].indexOf(v) > -1 ? ['**/*.map'] : []);
                                        });
                                })
                                .then(resolve);
                        })
                        : Object.values(DEPLOY_TARGETS).indexOf(selectedDeployTarget) > -1 ? Promise.resolve() : Promise.reject(new Error(`Invalid deploy target ${selectedDeployTarget}`));
                    targetConfigPromise
                        .then(() => {
                            logInfo(`Setting your appconfig for ${platform} to include deploy type: ${selectedDeployTarget}
                                on ${configFilePath}
                            `);
                            fs.writeFileSync(configFilePath, JSON.stringify(c.appConfigFile, null, 2));
                            resolve(selectedDeployTarget);
                        })
                        .catch(reject);
                    
                } else {
                    reject();
                }
            });
    });

const _checkDeployConfigTarget = (c, platform, targetConfig) =>
    new Promise((resolve, reject) => {
        logTask(`_checkDeployConfigTarget:${platform}`);
        if (targetConfig && targetConfig.deploy && targetConfig.deploy.type) {
            resolve(targetConfig.deploy.type);
        } else {
            _createDeployConfig(c, platform)
                .then(deployType => resolve(deployType))
                .catch(reject);
        }
    });

const _createEnvFtpConfig = (configFilePath, previousContent = '') =>
    new Promise((resolve, reject) => {
        let envContent = previousContent || '';
        askQuestion('Type your FTP host').then((v) => {
            finishQuestion();
            if (v) {
                envContent += `RNV_DEPLOY_WEB_FTP_SERVER=${v}\n`;
            } else {
                return reject(new Error('NO FTP SERVER PROVIDED'));
            }
            askQuestion('Type your FTP user').then((v) => {
                finishQuestion();
                if (v) {
                    envContent += `RNV_DEPLOY_WEB_FTP_USER=${v}\n`;
                } else {
                    return reject(new Error('NO FTP USER PROVIDED'));
                }
                askQuestion('Type your FTP password (or press ENTER for prompting every time)').then((v) => {
                    finishQuestion();
                    if (v) {
                        envContent += `RNV_DEPLOY_WEB_FTP_PASSWORD=${v}\n`;
                    }
                    askQuestion('Type your FTP port (or enter for 21)').then((v) => {
                        finishQuestion();
                        const port = !v || isNaN(v) ? 21 : v;
                        envContent += `RNV_DEPLOY_WEB_FTP_PORT=${port}`;
                        fs.writeFileSync(configFilePath, envContent);
                        logInfo(`Writing .env config to ${configFilePath}`)
                        resolve();
                    });
                });
            });
        });
    });

const _deployToFtp = (c, platform) =>
    new Promise((resolve, reject) => {
        logTask(`_deployToFtp:${platform}`);
        let promise;
        const envPath = path.resolve(c.projectRootFolder, '.env');
        if (!fs.existsSync(envPath)) {
            logInfo(`.env file does not exist. Creating one for you`);
            promise = _createEnvFtpConfig(envPath);
        } else {
            promise = new Promise((resolve, reject) => {
                fs.readFile(envPath, (err, data) => {
                    if (err) return reject(err);
                    resolve(data.toString());
                });
            });
        }
        promise.then((envContent) => {
            const envObj = {};
            let matches = 0;
            const targetMatches = 2;
            envContent.split('\n').map(line => line.split('=')).forEach(([key, val]) => {
                if(['RNV_DEPLOY_WEB_FTP_SERVER', 'RNV_DEPLOY_WEB_FTP_USER'].indexOf(key) > -1) {
                    matches++;
                }
            });
            let envPromise;
            if (matches >= targetMatches) {
                envPromise = Promise.resolve();
            } else {
                logInfo(`.env file does not contain all needed FTP config, helping you to set it up`);
                envPromise = _createEnvFtpConfig(envPath, `${envContent}\n`);
            }
            return envPromise;
        })
            .then(() => {
                require('dotenv').config();
                const config = {
                    user: process.env.RNV_DEPLOY_WEB_FTP_USER,
                    password: process.env.RNV_DEPLOY_WEB_FTP_PASSWORD,           // optional, prompted if none given
                    host: process.env.RNV_DEPLOY_WEB_FTP_SERVER,
                    port: process.env.RNV_DEPLOY_WEB_FTP_PORT || 21,
                    localRoot: c.appConfigFile.platforms[platform].deploy.localRoot,
                    remoteRoot: c.appConfigFile.platforms[platform].deploy.remoteRoot || '/',
                    include: c.appConfigFile.platforms[platform].deploy.include || ['*', '**/*'],      // this would upload everything except dot files
                    exclude: c.appConfigFile.platforms[platform].deploy.exclude || [],     // e.g. exclude sourcemaps - ** exclude: [] if nothing to exclude **
                    deleteRemote: c.appConfigFile.platforms[platform].deploy.exclude.deleteRemote || false,              // delete ALL existing files at destination before uploading, if true
                    forcePasv: true                 // Passive mode is forced (EPSV command is not sent)
                };
                return config;
            })
            .then((config) => {
                const FtpDeploy = require('ftp-deploy');
                const ftpDeploy = new FtpDeploy();
                return ftpDeploy.deploy(config)
            }).catch(reject);
    });

const deployWeb = (c, platform) => 
    new Promise((resolve, reject) => {
        logTask(`deployWeb:${platform}`);
        var argv = require('minimist')(c.process.argv.slice(2));
        let deployType = argv.t;
        // If not passed as argument, check in appConfig
        let promise = Promise.resolve(deployType);
        if (!deployType) {
            const p = c.appConfigFile.platforms[platform];
            promise = _checkDeployConfigTarget(c, platform, p);
        }
        promise.then((dt) => {
            logTask(`deployType:${dt}`);
            switch (dt) {
                case DEPLOY_TARGETS.FTP:
                    _deployToFtp(c, platform).then(resolve).catch(reject);
                    return;
                default:
                    reject(new Error(`Deploy Type not supported ${dt}`));
            }
        });
    });

/////

export { buildWeb, runWeb, configureWebProject, runWebDevServer, deployWeb };
