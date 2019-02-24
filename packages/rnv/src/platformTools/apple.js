import { executeAsync } from '../exec';

// const iosPlatforms = [IOS, TVOS];
// const runiOSUpdate = (c) => {
//     logTask('_runiOSUpdate');
//     if (iosPlatforms.includes(c.platform)) {
//         return _runPod('update', getAppFolder(c, IOS));
//     }
//
//     return Promise().resolve();
// };
//
// const runtvOSUpdate = (c) => {
//     logTask('_runtvOSUpdate');
//     if (iosPlatforms.includes(c.platform)) {
//         return _runPod('update', getAppFolder(c, TVOS));
//     }
//
//     return Promise().resolve();
// };
//
// const runiOSInstall = (c) => {
//     logTask('_runiOSInstall');
//
//     return runPod('install', getAppFolder(c, IOS));
// };

const runPod = (cmd, cwd) => executeAsync('pod', [
    'update',
], {
    cwd,
    evn: process.env,
    stdio: 'inherit',
});

export { runPod };
