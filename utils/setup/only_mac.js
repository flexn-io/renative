/* eslint-disable no-console */
const { sed } = require('shelljs');
const path = require('path');
const { executeAsync } = require('./node_utils');

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
                    path.resolve(__dirname, '..', 'node_modules/react-native/Libraries/NativeAnimation/RCTNativeAnimatedNodesManager.h')
                );
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
            return executeAsync('react-native run-ios', [
                '--project-path',
                'ios',
                '--simulator',
                '"iPhone 6"',
            ]);
        });
};

/* eslint-disable-next-line arrow-body-style */
const runtvOS = () => {
    return onlyMac()
        .then(() => {
            console.log('Running tvOS');
            return executeAsync('react-native run-ios', [
                '--project-path',
                'tvos',
                '--simulator',
                '"Apple TV"',
                '--scheme',
                'NextGenTVOS',
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

module.exports = {
    onlyMac,
    fixiOS,
    runiOS,
    runtvOS,
    updateiOS,
    updatetvOS,
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
    default:
        break;
    }
}
