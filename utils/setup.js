/* eslint-disable no-console */
// Because we are deleting node_modules
/* eslint-disable global-require */
const { sed } = require('shelljs');
const shell = require('shelljs');
const path = require('path');
const { removeDirAsyncWithNode, removeDirAsyncWithRimraf, executeAsync, copyFileSync } = require('./node_utils');

const fs = require('fs');


const checkExternalDependencies = () => {
    const semver = require('semver');
    const { engines } = require('../package.json');
    return executeAsync('node', ['--version'], {})
        .catch(() => {
            // Should never happen, this is a node script ;)
            console.log('No node installation detected.');
            throw new Error('No node installation detected.');
        })
        .then((result) => {
            console.log('Node detected:', result);
            if (semver.satisfies(semver.coerce(result), engines.node)) {
                console.log('Your node version satisfies the requirements');
                return 'ok';
            }
            console.warn('Your node version does NOT match the requirements:', result, 'VS', engines.node);

            throw new Error('Your node version does NOT match the requirements');
        })
        /* eslint-disable-next-line arrow-body-style */
        .then(() => {
            return executeAsync(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['--version'], {})
                .catch(() => {
                    // Should never happen as npm comes with node
                    console.error('Please install npm', engines.npm);
                    throw new Error('Please install npm');
                })
                .then((result) => {
                    if (semver.satisfies(semver.coerce(result), engines.npm)) {
                        console.log('Your npm version satisfies the requirements');
                        return 'ok';
                    }
                    console.warn('Your npm version does NOT match the requirements:', result, 'VS', engines.npm);
                    // TODO: NPM version install for dummies?
                    // npm i -g ${engines.npm} // or semver.coerce(engines.npm)
                    throw new Error('Your npm version does not fulfill the requirements');
                });
        })
        .then(() => {
            if (/darwin/i.test(process.platform)) {
                return executeAsync('xcodebuild', ['-version'], {})
                    .catch(() => {
                        console.error('No Xcode installation found.');
                        throw new Error('No Xcode installation found.');
                    })
                    .then((result) => {
                        const cleanResult = result.split('\n')[0];
                        if (semver.satisfies(semver.coerce(cleanResult), engines.xcode)) {
                            console.log('Your Xcode version meets the requirements');
                            return 'ok';
                        }
                        console.warn('Your Xcode does not meet the requirements', cleanResult, 'VS', engines.xcode);
                        throw new Error('Your Xcode does not meet the requirements');
                    });
            }
            return Promise.resolve();
        })
        .then(() => {
            if (/darwin/i.test(process.platform)) {
                return executeAsync('pod', ['--version'], {})
                    .catch(() => {
                        console.error('No installation of CocoaPods found');

                        throw new Error('No installation of CocoaPods found');
                    })
                    .then((result) => {
                        if (semver.satisfies(semver.coerce(result), engines.cocoapods)) {
                            console.log('Your cocoapods version satisfies the requirements');
                            return 'ok';
                        }
                        console.warn('Your cocoapods version does NOT match the requirements:', result, 'VS', engines.cocoapods);

                        throw new Error('Your cocoapods version does NOT match the requirements');
                    });
            }
            return Promise.resolve();
        });
};

/* eslint-disable-next-line arrow-body-style */
const checkSDKs = () => {
    return Promise.resolve();
};

/* eslint-disable-next-line arrow-body-style */
const cleanNodeModules = () => {
    console.log('1 - Cleaning & fresh install of node_modules');
    return new Promise((resolve, reject) => {
        removeDirAsyncWithNode('./node_modules', (error) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    resolve();
                } else {
                    console.log('cleanNodeModules failed, error:', error);
                    reject(error);
                }
            } else {
                resolve();
            }
        });
    });
};

/* eslint-disable-next-line arrow-body-style */
const installNPMDependecies = () => {
    console.log('1.2 - Running npm install');
    return new Promise((resolve) => {
        executeAsync(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install'])
            .then(() => {
                console.log('Dependencies installed!');
                resolve();
            })
            .catch((error) => {
                console.error(`NPM install failed, error: ${error}`);
            });
    });
};

/* eslint-disable-next-line arrow-body-style */
const cleanBuilds = () => {
    console.log('2 - Cleaning build folders');
    return Promise.all([
        removeDirAsyncWithRimraf('./platforms/ios/build'),
        removeDirAsyncWithRimraf('./platforms/tvos/build'),
    ])
        .then(() => {
            console.log('Builds deleted!');
        });
};

/* eslint-disable-next-line arrow-body-style */
const podUpdate = () => {
    return updateiOS()
        .then(updatetvOS)
        .catch((error) => {
            const thrownError = `Error updating Apple pods ${error}`;
            console.error(thrownError);
            throw new Error(thrownError);
        });
};

/* eslint-disable-next-line arrow-body-style */
const onlyMac = () => {
    return new Promise((resolve, reject) => {
        if (/darwin/i.test(process.platform)) {
            resolve();
        } else {
            reject();
        }
    }).catch(() => {
        throw new Error('Feature/command only supported on macOSX. iOS/tvOS commands are only for macOSX.');
    });
};

/* eslint-disable-next-line arrow-body-style */
const fixiOS = () => {
    return onlyMac()
        .then(() => {
            console.log('Fixing iOS');
            try {
                sed(
                    '-i',
                    '#import <RCTAnimation/RCTValueAnimatedNode.h>',
                    '#import "RCTValueAnimatedNode.h"',
                    path.resolve(__dirname, '..', 'node_modules/react-native/Libraries/NativeAnimation/RCTNativeAnimatedNodesManager.h'),
                );

                sed(
                    '-i',
                    '#import <WebKit/WebKit.h>',
                    '',
                    path.resolve(__dirname, '..', 'node_modules/react-native/React/Base/RCTConvert.h'),
                );

                // Replace Podspec
                const podSource = path.resolve(__dirname, 'fix/React.podspec');
                const podDest = path.resolve(__dirname, '..', 'node_modules/react-native/React.podspec');
                copyFileSync(podSource, podDest);

                return Promise.resolve();
            } catch (error) {
                console.error('sed failed: ', error);
                return Promise.reject();
            }
        });
};

/* eslint-disable-next-line arrow-body-style */
const runiOS = () => {
    return onlyMac()
        .then(() => {
            console.log('Running iOS');
            return executeAsync('react-native', [
                'run-ios',
                '--project-path',
                'platforms/ios',
                '--simulator',
                'iPhone 6',
            ]);
        });
};

/* eslint-disable-next-line arrow-body-style */
const runtvOS = () => {
    return onlyMac()
        .then(() => {
            console.log('Running tvOS');
            return executeAsync('react-native', [
                'run-ios',
                '--project-path',
                'platforms/tvos',
                '--simulator',
                'Apple TV',
                '--scheme',
                'ReactNativeVanillaTVOS',
            ]);
        });
};

/* eslint-disable-next-line arrow-body-style */
const updatePods = (folder) => {
    return onlyMac()
        .then(() => {
            console.log('Updating Pods for', folder);
            return executeAsync('pod', [
                'update',
            ], {
                cwd: folder,
                evn: process.env,
                stdio: 'inherit',
            });
        })
        .catch((error) => {
            console.error('Error updating pods', error);
            throw new Error(`Error updating pods ${error}`);
        });
};

/* eslint-disable-next-line arrow-body-style */
const updateiOS = () => {
    return onlyMac()
        .then(() => {
            console.log('Updating iOS');
            return updatePods('platforms/ios');
        });
};

/* eslint-disable-next-line arrow-body-style */
const updatetvOS = () => {
    return onlyMac()
        .then(() => {
            console.log('Updating tvOS');
            return updatePods('platforms/tvos');
        });
};

const _runWebOS = () => {
    const tDir = path.resolve(__dirname, '..', 'platforms/webos');
    const tOut = path.resolve(__dirname, '..', 'platforms/webos/output');
    const tSim = args[1] || 'emulator';

    const workspacePathWebOS = './platforms/webos';
    const configFilePath = `${workspacePathWebOS + path.sep}appinfo.json`;
    const cnfg = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    const tId = cnfg.id;
    const appPath = path.join(tOut, `${tId}_${cnfg.version}_all.ipk`);

    shell.exec(`npm run webos:build && ares-package -o ${tOut} ${tDir} && ares-install --device ${tSim} ${appPath}`, () => {
        shell.exec(`ares-launch --device ${tSim} ${tId}`);
    });
};

const _runAndroidWear = () => {
    const tDir = path.resolve(__dirname, '..', 'platforms/androidwear');
    const resDir = path.join(tDir, 'app/src/main/res');
    executeAsync('react-native', [
        'bundle',
        '--platform',
        'android',
        '--dev',
        'false',
        '--assets-dest',
        `${resDir}`,
        '--entry-file',
        'index.androidwear.js',
        '--bundle-output',
        `${tDir}/app/src/main/assets/index.android.bundle`,
    ]).then((v) => {
        shell.cd(`${tDir}`);
        shell.exec('./gradlew appStart');
    });
};


/* eslint-disable-next-line no-unused-vars */
const [context, file, ...args] = process.argv;
if (file === __filename) {
    switch (args[0]) {
    case 'run_ios':
        runiOS()
            .catch((error) => {
                console.error('ios failed:', error.message);
                process.exit();
            });
        break;
    case 'run_androidwear':
        _runAndroidWear();
        break;
    case 'run_tvos':
        runtvOS()
            .catch((error) => {
                console.error('ios failed:', error.message);
                process.exit();
            });
        break;
    case 'fix_ios':
        fixiOS()
            .catch((error) => {
                console.error('ios:fix failed:', error.message);
                process.exit();
            });
        break;
    case 'update_ios':
        updateiOS()
            .catch((error) => {
                console.error('ios:update failed:', error.message);
                process.exit();
            });
        break;
    case 'update_tvos':
        updatetvOS()
            .catch((error) => {
                console.error('tvos:update failed:', error.message);
                process.exit();
            });
        break;
    case 'run_tizen':
        const tDir = path.resolve(__dirname, '..', 'platforms/tizen');
        const tOut = path.resolve(__dirname, '..', 'platforms/tizen/output');
        const tBuild = path.resolve(__dirname, '..', 'platforms/tizen/build');
        const tId = 'NvVRhWHJST.ReactNativeVanilla';
        const tSim = args[1] || 'T-samsung-4.0-x86';
        const gwt = 'ReactNativeVanilla.wgt';

        shell.exec(`npm run tizen:build && tizen build-web -- ${tDir} -out ${tBuild} && tizen package -- ${tBuild} -t wgt -o ${tOut} && tizen uninstall -p ${tId} -t ${tSim} && tizen install -- ${tOut} -n ${gwt} -t ${tSim}`, () => {
            shell.exec(`tizen run -p ${tId} -t ${tSim}`);
        });
        break;
    case 'run_webos':
        _runWebOS();
        break;
    case 'setup':
        console.log('REACT-NATIVE-VANILLA');
        cleanNodeModules()
            .then(installNPMDependecies)
            .then(cleanBuilds)
            .then(checkExternalDependencies)
            // .then(checkSDKs)
            .then(fixiOS, (error) => {
                if (error && error.message === 'Not macosx') {
                    return 'ok';
                }
                throw error;
            })
            .then(() => onlyMac()
                .then(podUpdate, () => {
                    console.log('You are not on a macOSX environment, so skipping ios/tvos setup');
                    throw new Error('Not macosx');
                }))
            .then(() => {
                console.log('SETUP COMPLETED');
                process.exit();
            })
            .catch((error) => {
                console.error('Setup failed', error);
                process.exit(1);
            });
        break;
    }
}

module.exports = {
    onlyMac,
    fixiOS,
    runiOS,
    runtvOS,
    updateiOS,
    updatetvOS,
};
