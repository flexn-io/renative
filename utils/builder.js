
const { copyDirContents, executeAsync } = require('./node_utils');

/* eslint-disable-next-line arrow-body-style */
const distWindows = () => {
    console.log('Dist Windows');
    try {
        return copyDirContents('./platforms/windows', './platforms/electron').then(() => {
            console.log('Dist Windows ...');
        });
    } catch (error) {
        console.error('dist failed: ', error);
        return Promise.reject();
    }
};

/* eslint-disable-next-line arrow-body-style */
const distMacOS = () => {
    console.log('Dist MacOS');
    try {
        return copyDirContents('./platforms/macos', './platforms/electron').then(() => {
            console.log('Dist MacOS ...');
        });
    } catch (error) {
        console.error('dist failed: ', error);
        return Promise.reject();
    }
};

module.exports = {
    distWindows,
    distMacOS,
};

/* eslint-disable-next-line no-unused-vars */
const [context, file, ...args] = process.argv;
if (file === __filename) {
    switch (args[0]) {
    case 'dist_windows':
        distWindows()
            .catch((error) => {
                console.error('dist windows failed:', error.message);
                process.exit();
            });
        break;
    case 'dist_macos':
        distMacOS()
            .catch((error) => {
                console.error('dist macos failed:', error.message);
                process.exit();
            });
        break;
    case 'dist_tizen':

        break;
    default:
        break;
    }
}
