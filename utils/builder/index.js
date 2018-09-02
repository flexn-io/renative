
const { copyDirContents, executeAsync } = require('../setup/node_utils');

/* eslint-disable-next-line arrow-body-style */
const distWindows = () => {
  console.log('Dist Windows');
  try {
      return copyDirContents('./platforms/windows', './platforms/electron').then(() => {
        console.log('Dist Windows ...');
        // return executeAsync('electron-builder', []).then(() => {
        //   console.log('Dist Windows Done');
        // })
      })
  } catch (error) {
      console.error('dist failed: ', error);
      return Promise.reject();
  }
};

module.exports = {
    distWindows
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

        break;
    case 'dist_tizen':

        break;
    default:
        break;
    }
}
