/* eslint-disable no-console */
// Because we are deleting node_modules
/* eslint-disable global-require */
const { removeDirAsyncWithNode, removeDirAsyncWithRimraf, executeAsync } = require('./node_utils');

console.log(`INITIALIZING`);
console.log('1 - Cleaning & fresh install of node_modules');
console.log('1.1 - Cleaning node_modules (may take a while if it is not a fresh install)');

const checkExternalDependencies = () => {
    const semver = require('semver');
    // const Confirm = require('prompt-confirm');
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
            // TODO: installation of nvm and node for dummies?
            // const nodePrompt =
            // new Confirm('Do you want to install a suitable node version via nvm?');
            // nodePrompt.ask((answer) => {
            //     console.log('answer', answer);
            //     if (answer) {
            //         executeAsync('nvm', ['ls'], {})
            //           .catch /* install nvm */
            //           .then /* nvm use requiredVersion */
            //     }
            // });
            throw new Error('Your node version does NOT match the requirements');
        })
        // For readability
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
                        // TODO: Install CocoaPods for dummies?
                        // sudo gem install cocoapods -v ${engines.cocoapods}
                        // or semver.coerce(engines.cocoapods)
                        throw new Error('No installation of CocoaPods found');
                    })
                    .then((result) => {
                        if (semver.satisfies(semver.coerce(result), engines.cocoapods)) {
                            console.log('Your cocoapods version satisfies the requirements');
                            return 'ok';
                        }
                        console.warn('Your cocoapods version does NOT match the requirements:', result, 'VS', engines.cocoapods);
                        // TODO: Install CocoaPods for dummies?
                        // sudo gem install cocoapods -v ${engines.cocoapods}
                        // or semver.coerce(engines.cocoapods)
                        // This will keep installed both versions of cocoapods
                        // podUpdate must specify the version
                        // `pod _${semver.coerce(engines.cocoapods)}_ setup` command is required
                        throw new Error('Your cocoapods version does NOT match the requirements');
                    });
            }
            return Promise.resolve();
        });
};
// For readability
/* eslint-disable-next-line arrow-body-style */
const cleanNodeModules = () => {
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
    return Promise.all([
        executeAsync('npm', ['run', 'ios:update']),
        executeAsync('npm', ['run', 'tvos:update']),
    ])
        .catch((error) => {
            const thrownError = `Error updating Apple pods ${error}`;
            console.error(thrownError);
            throw new Error(thrownError);
        });
};

/* eslint-disable-next-line arrow-body-style */
const fixiOS = () => {
    return executeAsync('npm', ['run', 'ios:fix']);
};


cleanNodeModules()
    .then(installNPMDependecies)
    .then(cleanBuilds)
    .then(checkExternalDependencies)
    .then(() => {
        const { onlyMac } = require('./only_mac');
        return onlyMac()
            .then(podUpdate, () => {
                console.log('You are not on a macOSX environment, so skipping ios/tvos setup');
                throw new Error('Not macosx');
            })
            .then(fixiOS, (error) => {
                if (error && error.message === 'Not macosx') {
                    return 'ok';
                }
                throw error;
            });
    })
    .catch((error) => {
        console.error('Setup failed', error);
        process.exit(1);
    });
