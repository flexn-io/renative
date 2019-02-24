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

const runPod = (command, cwd) => executeAsync('pod', [
    command,
], {
    cwd,
    evn: process.env,
    stdio: 'inherit',
});

const copyAppleAssets = (c, platform, appFolder) => new Promise((resolve, reject) => {
    logTask('copyAppleAssets');
    if (!_isPlatformActive(c, platform, resolve)) return;

    const iosPath = path.join(getAppFolder(c, platform), appFolder);
    const sPath = path.join(c.appConfigFolder, `assets/${platform}`);
    copyFolderContentsRecursiveSync(sPath, iosPath);
    resolve();
});

const configureXcodeProject = (c, platform, appFolder) => new Promise((resolve, reject) => {
    logTask('configureXcodeProject');
    if (!_isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);

    fs.writeFileSync(path.join(appFolder, 'main.jsbundle'), '{}');
    mkdirSync(path.join(appFolder, 'assets'));
    mkdirSync(path.join(appFolder, `${appFolder}/images`));

    resolve();
});

export { runPod, copyAppleAssets, configureXcodeProject };
